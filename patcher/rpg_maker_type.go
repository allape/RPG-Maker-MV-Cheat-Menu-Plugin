package main

import (
	"bytes"
	"fmt"
	"github.com/robertkrimen/otto/ast"
	"github.com/robertkrimen/otto/parser"
	"os"
)

type RPGMakerEngineType struct {
	Name    string `json:"name"`
	Handler func()
}

func panicEngineType(str string) {
	_, _ = Red.Printf("Unable to patch this Game, %s\n", str)
}

func InjectPatchPlugin(pluginsDotJs string, patcherName string) {
	_, err := os.Stat(pluginsDotJs)
	if err != nil {
		panicEngineType(fmt.Sprintf("%s does NOT exist", pluginsDotJs))
		return
	}
	pluginsDotJsContent, err := os.ReadFile(pluginsDotJs)
	if err != nil {
		panicEngineType(fmt.Sprintf("unable to load %s", pluginsDotJs))
		return
	}
	program, err := parser.ParseFile(nil, "", string(pluginsDotJsContent), 0)
	if err != nil {
		panicEngineType("failed to patch programmatically, please patch this game manually...😅")
		return
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
												panicEngineType("because this Game has been patched 😊")
												return
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
							pluginObjectBytes := []byte(fmt.Sprintf("{\"name\":\"%s\",\"status\":true,\"description\":\"\",\"parameters\":{}},", patcherName))
							extraBytes := []byte("")
							if len(suffixBytes) > 0 && suffixBytes[0] != '\n' {
								extraBytes = []byte("\n")
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
								panicEngineType(fmt.Sprintf("failed to write into %s", pluginsDotJs))
								return
							}
							_, _ = Cyan.Printf("Patched this Game successfully! Enjoy! 😄\n")
						} else {
							panicEngineType("unable to find a place to patch...")
						}
						return
					}
				}
			}
		}
	}
	panicEngineType(fmt.Sprintf("%s is not a valid plugins.js file", pluginsDotJs))
}

//var RPGMakerEngineTypes = []RPGMakerEngineType{
//	{
//		Name: "Auto",
//		Handler: func() {
//			pwd, err := os.Getwd()
//			if err != nil {
//				panicEngineType("can NOT read current running folder")
//				panic(err)
//			}
//			fs.FileInfo()
//		},
//	},
//	{
//		Name: "MV",
//		Handler: func() {
//			pwd, err := os.Getwd()
//			if err != nil {
//				panicEngineType("can NOT read current running folder")
//				panic(err)
//			}
//			jsFolder, err := os.Stat(path.Join(pwd, "www/js"))
//			if err != nil {
//				panicEngineType("this is NOT a game made by RPG Maker MV")
//			}
//			pluginsFolder, err := os.Stat(path.Join(pwd, "www/js/plugins"))
//			if err != nil {
//				panicEngineType("this is no plugins folder found")
//			}
//		},
//	},
//}
