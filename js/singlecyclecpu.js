/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Shane Harvey
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
 
/**
 * Represents a MIPS CPU with a single cycle datapath.
 * @constructor
 */
function SingleCycleCPU() {
	"use strict";
	var this.CLOCK = 1000; 	// "Clock" speed
	var this.time = 0; 		// Current time within the clock cycle
	/* Delay for each visible CPU component */
	var this.delay = {
		andGate: 	1, 
		mux: 		2,
		signExt: 	3,
		shift: 		4,
		adder: 		5,
		aluControl: 6,
		contol: 	7,
		insMem: 	8,
		regFile: 	9,
		alu: 		10,
		dataMem:  	11 
	};
	/* MIPS Registers */
	var this.pc = 0;		// the program counter register
	var this.hi = 0;		// upper 32 bits of mult and remainder of div
	var this.lo = 0;		// lower 32 bits of mult and result of div
	/*
	 *
	 * Name		Number		Use								Callee must preserve?
	 * $zero	$0			constant 0						N/A
	 * $at		$1			assembler temporary				No
	 * $v0–$v1	$2–$3		values for function returns 	No
	 * $a0–$a3	$4–$7		function arguments				No
	 * $t0–$t7	$8–$15		temporaries						No
	 * $s0–$s7	$16–$23		saved temporaries				Yes
	 * $t8–$t9	$24–$25		temporaries						No
	 * $k0–$k1	$26–$27		reserved for OS kernel			N/A
	 * $gp		$28			global pointer					Yes
	 * $sp		$29			stack pointer					Yes
	 * $fp		$30			frame pointer					Yes
	 * $ra		$31			return address					N/A
	 */
	var this.reg = new Array(32);
	var this.ir = 0; 		// Register to hold the current instruction.

	/* Variables used to track information flow along the cpu */
	var this.flow = {
		
	};
	/* Control Variables */
	var this.control = {
		regDst: 	null,
		jump: 		null,
		branch: 	null,
		memRead: 	null,
		memtoReg: 	null,
		aluOp: 		null,
		memWrite: 	null,
		regWrite: 	null
	};

	function resetControl(){
		this.control.regDst		= null;
		this.control.jump		= null;
		this.control.branch		= null;
		this.control.memRead	= null;
		this.control.memtoReg	= null;
		this.control.aluOp		= null;
		this.control.memWrite	= null;
		this.control.regWrite	= null;
	}

	function fetch(){

	}

	function decode(){

	}

	function execute(){

	}

	/**
	 * 32 bit ALU operations.
	 */
	function add(){

	}




	/** Starts the cpu once registers and instruction/data memory are loaded. */
	function start(){

	}
}