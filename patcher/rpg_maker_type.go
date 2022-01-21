package main

import (
	"bytes"
	"fmt"
	"os"
	"path"

	"github.com/robertkrimen/otto/ast"
	"github.com/robertkrimen/otto/parser"
)

type RPGMakerEngineType struct {
	Name    string `json:"name"`
	Handler func(pluginName string, shouldBackupPluginJs bool) bool
}

func panicEngineType(str string) bool {
	_, _ = Red.Printf("Unable to patch this Game, %s\n", str)
	return false
}

func InjectPatchPlugin(pluginsDotJs string, patcherName string, shouldBackupPluginJs bool) bool {
	_, err := os.Stat(pluginsDotJs)
	if err != nil {
		return panicEngineType(fmt.Sprintf("%s does NOT exist", pluginsDotJs))
	}
	pluginsDotJsContent, err := os.ReadFile(pluginsDotJs)
	if err != nil {
		return panicEngineType(fmt.Sprintf("unable to load %s", pluginsDotJs))
	}
	program, err := parser.ParseFile(nil, "", string(pluginsDotJsContent), 0)
	if err != nil {
		return panicEngineType("failed to patch programmatically, please patch this game manually...😅")
	}
	for _, declaration := range program.DeclarationList {
		if vd, ok := declaration.(*ast.VariableDeclaration); ok {
			for _, expression := range vd.List {
				if expression.Name == "$plugins" {
					if plugins, ok := expression.Initializer.(*ast.ArrayLiteral); ok {
						// check this game has whether been patched
						for _, value := range plugins.Value {
							if item, ok := value.(*ast.ObjectLiteral); ok {
								for _, property := range item.Value {
									if property.Key == "name" {
										if pluginName, ok := property.Value.(*ast.StringLiteral); ok {
											if pluginName.Value == patcherName {
												return panicEngineType("because this Game has been patched 😊")
											}
										}
									}
								}
							}
						}
						// inject a json at the end of the array
						pluginsArrayRightBracketIndex := plugins.Idx1()
						readyForInjection := false
						var prefixBytes []byte
						var contentBytes []byte
						var suffixBytes []byte
						for i := pluginsArrayRightBracketIndex - 1; i > 0; i-- {
							currentChar := pluginsDotJsContent[i]

							// statement 1
							/// var $plugins = [];
							if currentChar == '[' {
								i++
								prefixBytes = pluginsDotJsContent[0:i]
								contentBytes = []byte("\n")
								suffixBytes = pluginsDotJsContent[i:]
								readyForInjection = true
								break
							}

							// statement 2
							/// var $plugins = [
							///     {...}
							/// ];
							if currentChar == '}' {
								i++
								prefixBytes = pluginsDotJsContent[0:i]
								contentBytes = []byte(",\n")
								suffixBytes = pluginsDotJsContent[i:]
								readyForInjection = true
								break
							}

							// statement 3
							/// var $plugins = [
							///     {...},
							/// ];
							if currentChar == ',' {
								i++
								prefixBytes = pluginsDotJsContent[0:i]
								contentBytes = []byte("\n")
								suffixBytes = pluginsDotJsContent[i:]
								readyForInjection = true
								break
							}
						}
						if readyForInjection {
							pluginObjectBytes := []byte(fmt.Sprintf("{\"name\":\"%s\",\"status\":true,\"description\":\"\",\"parameters\":{}}", patcherName))
							extraBytes := []byte("")
							if len(suffixBytes) > 0 && suffixBytes[0] != '\n' {
								extraBytes = []byte("\n")
							}
							if shouldBackupPluginJs {
								backupFileName := pluginsDotJs + ".bak"
								err = os.WriteFile(backupFileName, pluginsDotJsContent, 0o666)
								if err != nil {
									return panicEngineType(fmt.Sprintf("failed to backup %s as %s", pluginsDotJs, backupFileName))
								}
							}
							err = os.WriteFile(
								pluginsDotJs,
								bytes.Join(
									[][]byte{
										prefixBytes,
										contentBytes,
										pluginObjectBytes,
										extraBytes,
										suffixBytes,
									},
									[]byte(""),
								),
								0o666,
							)
							if err != nil {
								return panicEngineType(fmt.Sprintf("failed to write into %s", pluginsDotJs))
							}
							_, _ = Cyan.Printf("%s patched!\n", patcherName)
							return true
						} else {
							return panicEngineType("unable to find a place to patch...")
						}
					}
				}
			}
		}
	}
	return panicEngineType(fmt.Sprintf("%s is not a valid plugins.js file", pluginsDotJs))
}

const Auto = "Auto"

var RPGMakerEngineTypes = []RPGMakerEngineType{
	{
		Name: Auto,
		Handler: func(pluginName string, shouldBackupPluginJs bool) bool {
			return false
		},
	},
	{
		Name: "MV",
		Handler: func(pluginName string, shouldBackupPluginJs bool) bool {
			pwd, err := os.Getwd()
			if err != nil {
				return panicEngineType("can NOT read current running folder")
			}
			pluginsJsPath := path.Join(pwd, "www/js/plugins.js")
			_, err = os.Stat(pluginsJsPath)
			if err != nil {
				return panicEngineType("this is NOT a RPG Maker MV game")
			}
			return InjectPatchPlugin(pluginsJsPath, pluginName, shouldBackupPluginJs)
		},
	},
	{
		Name: "MZ",
		Handler: func(pluginName string, shouldBackupPluginJs bool) bool {
			pwd, err := os.Getwd()
			if err != nil {
				return panicEngineType("can NOT read current running folder")
			}
			pluginsJsPath := path.Join(pwd, "js/plugins.js")
			_, err = os.Stat(pluginsJsPath)
			if err != nil {
				return panicEngineType("this is NOT a RPG Maker MZ game")
			}
			return InjectPatchPlugin(pluginsJsPath, pluginName, shouldBackupPluginJs)
		},
	},
}
