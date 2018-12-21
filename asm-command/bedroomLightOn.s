	.data
	.balign 4
Intro:	.asciz	"Switching on bedroom ligth\n"
ErrMsg:	.asciz	"Set up didn't work :-("
pin:	.int	9
delayMs:.int	5000
OUTPUT = 1

	.text
	.global main
	.extern printf
	.extern wiringPiSetup
	.extern delay
	.extern digitalWrite
	.extern pinMode

main:	push	{ip, lr}

	LDR	R0, =Intro
	BL	printf

	BL	wiringPiSetup
	MOV	R1, #-1
	CMP	R0, R1
	BNE	init
	LDR	R0, =ErrMsg
	BL	printf
	B 	done

@	pinMode(pin, OUTPUT)
init:
	LDR	R0, =pin
	LDR	R0, [R0]
	MOV	R1, #OUTPUT
	BL	pinMode

	LDR	R0, =pin
	LDR	R0, [R0]
	MOV	R1, #1
	BL	digitalWrite

@	LDR	R0, =delayMs
@	LDR	R0, [R0]
@	BL	delay

done:
	POP	{ip, pc}

