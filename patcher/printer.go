package main

import "github.com/fatih/color"

var Green *color.Color
var Cyan *color.Color
var RedUnderline *color.Color
var Red *color.Color

func InitColorfulOutput() {
	Green = color.New(color.FgGreen)
	Cyan = color.New(color.FgCyan)
	RedUnderline = color.New(color.FgRed).Add(color.Underline)
	Red = color.New(color.FgRed)
}
