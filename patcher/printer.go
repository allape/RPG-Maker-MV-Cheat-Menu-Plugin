package main

import "github.com/fatih/color"

var CyanUnderline *color.Color
var Cyan *color.Color
var RedUnderline *color.Color
var Red *color.Color

func InitColorfulOutput() {
	CyanUnderline = color.New(color.FgCyan).Add(color.Underline)
	Cyan = color.New(color.FgCyan)
	RedUnderline = color.New(color.FgRed).Add(color.Underline)
	Red = color.New(color.FgRed)
}
