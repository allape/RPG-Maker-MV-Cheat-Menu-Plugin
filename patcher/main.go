package main

import (
	"bufio"
	"os"
	"path"
	"strings"

	"github.com/manifoldco/promptui"
)

const pluginsPatchFileName = "plugins_patch.go.txt"

var pluginNames []string

var shouldBackupPluginsJs = false

func promptBackUpPluginJs() {
	const yes = "Yes"
	const no = "NO!"

	prompt := promptui.Select{
		Label: "Backup Original plugins.js",
		Items: []string{yes, no},
	}

	_, result, err := prompt.Run()

	if err != nil {
		_, _ = RedUnderline.Printf("Prompt failed %v\n", err)
		return
	}

	shouldBackupPluginsJs = result == yes
}

func promptTypes() {
	typeCount := len(RPGMakerEngineTypes)

	types := make([]string, typeCount)
	for i := 0; i < len(types); i++ {
		types[i] = RPGMakerEngineTypes[i].Name
	}

	prompt := promptui.Select{
		Label: "Select The RPG Maker Engine",
		Items: types,
	}

	_, result, err := prompt.Run()

	if err != nil {
		_, _ = RedUnderline.Printf("Prompt failed %v\n", err)
		return
	}

	// Skip Auto
	for i := 1; i < typeCount; i++ {
		engineType := RPGMakerEngineTypes[i]
		if engineType.Name == result || result == Auto {
			userSelectedShouldBackupPluginsJs := shouldBackupPluginsJs
			for i := 0; i < len(pluginNames); i++ {
				trimmedPluginName := strings.TrimSpace(pluginNames[i])
				if trimmedPluginName != "" {
					userSelectedShouldBackupPluginsJs = !engineType.Handler(trimmedPluginName, userSelectedShouldBackupPluginsJs)
				}
			}
		}
	}
}

func main() {
	InitColorfulOutput()

	_, _ = Cyan.Printf("Initializing patcher...\n")

	pwd, err := os.Getwd()
	if err != nil {
		_, _ = RedUnderline.Printf("unable to read file %s\n", pluginsPatchFileName)
		return
	}

	// read plugins_patch.txt
	pluginsPatchBytes, err := os.ReadFile(path.Join(pwd, pluginsPatchFileName))
	if err != nil {
		_, _ = RedUnderline.Printf("failed to read file %s\n", pluginsPatchFileName)
		return
	}
	pluginsPatchContent := string(pluginsPatchBytes)

	pluginNames = strings.Split(pluginsPatchContent, "\n")

	promptBackUpPluginJs()

	promptTypes()

	_, _ = Cyan.Printf("Done, press \"Enter\" to exit...\n")
	_, _ = bufio.NewReader(os.Stdin).ReadString('\n')
	os.Exit(0)
}
