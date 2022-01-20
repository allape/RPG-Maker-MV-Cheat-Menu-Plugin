package main

import (
	"github.com/manifoldco/promptui"
	"os"
	"path"
	"strings"
)

const pluginsPatchFileName = "plugins_patch.txt"

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

	pluginNames := strings.Split(pluginsPatchContent, "\n")

	types := make([]string, 3)
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

	if result == Auto {
		for i := 1; i < len(RPGMakerEngineTypes); i++ {
			engineType := RPGMakerEngineTypes[i]
			runInjection(engineType, pluginNames, false)
		}
	} else {
		for i := 0; i < len(RPGMakerEngineTypes); i++ {
			engineType := RPGMakerEngineTypes[i]
			if engineType.Name == result {
				runInjection(engineType, pluginNames, true)
			}
		}
	}

	_, _ = Cyan.Printf("Done, press \"Enter\" to exit...\n")
	os.Exit(0)
}

func runInjection(engineType RPGMakerEngineType, pluginNames []string, printMsg bool) {
	for i := 0; i < len(pluginNames); i++ {
		trimmedPluginName := strings.TrimSpace(pluginNames[i])
		if trimmedPluginName != "" {
			engineType.Handler(trimmedPluginName, printMsg)
		}
	}
}
