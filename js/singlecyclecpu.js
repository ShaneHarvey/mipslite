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
	//"use strict";
	this.CLOCK = 1000; 	// "Clock" speed
	this.time = 0; 		// Current time within the clock cycle

	/* Delay for each visible CPU component */
	this.delay = {
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
	/* MIPS Registers
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
	this.reg = new Int32Array(32); 	// Array of 32 32-bit twos complement signed integer
	this.pc = 0;		// the program counter register
	this.hi = 0;		// upper 32 bits of mult and remainder of dthis.lo = 0;		
	this.lo = 0;		// lower 32 bits of mult and result of div

	this.ir = 0; 		// Register to hold the current instruction.

	this.insMem = new Int32Array(128);
	this.insMem[0] = 537460836; 	//addi $t1, $0, 100
	this.insMem[1] = 19484704;		//add $t2, $t1, $t1

	/* Variables used to track information flow along the cpu */
	this.flow = {
		//STUFF TO USE FOR DISPLAY
		pc: 		null,
		pc4: 		null,
		pc4_31_28: 	null,
		readReg1: 	null,
		readReg2: 	null,
		writeReg: 	null,
		rawImmed: 	null,
		ins25_0: 	null,
		ins25_02: 	null,
		jumpAddr: 	null,
		immed: 		null
	};
	/* Control Variables */
	this.control = {
		regDst: 	null,
		jump: 		null,
		zero: 		null,
		pcSrc: 		null,
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
		this.control.zero		= null;
		this.control.pcSrc		= null;
		this.control.branch		= null;
		this.control.memRead	= null;
		this.control.memtoReg	= null;
		this.control.aluOp		= null;
		this.control.memWrite	= null;
		this.control.regWrite	= null;
	}

	function and(input0, input1){
		return input0 && input1;
	}
	function adder(input0, input1){
		return input0 + input1;
	}

	function mux(input0, input1, control){
		return control? input1: input0;
	}

	function shiftLeft2(input){
		return input << 2;
	}

	function signExtend(input){
		return input;
	}
	function fetch(){
		this.flow.pc = this.pc;
		this.flow.pc4 = adder(this.pc, 4);
		this.flow.pc4_31_28 = (this.flow.pc4 & 0xF0000000);
		this.ir = this.insMem[this.pc];
	}

	function decode(){
		control();
		this.flow.readReg1 	= (this.ir & 0x03FFFFFF) >> 21;
		this.flow.readReg2 	= (this.ir & 0x001FFFFF) >> 16;
		this.flow.writeReg 	= (this.ir & 0x0000FFFF) >> 11;
		this.flow.rawImmed	= (this.ir & 0x0000FFFF);
		this.flow.ins25_0	= (this.ir & 0x03FFFFFF);
		this.flow.ins25_02	= shiftLeft2(this.flow.ins25_0);
		this.flow.jumpAddr	= this.flow.ins25_02 & (this.flow.pc4_31_28 | 0x0FFFFFFF);
		this.flow.immed 	= signExtend(this.flow.rawImmed);
		this.flow.brOffset	= shiftLeft2(this.flow.immed);
		this.flow.brAddr	= adder(this.flow.pc4, this.flow.brOffset);


		//After ALU 
		this.control.pcSrc 	= and(this.control.branch, this.control.zero);
		this.flow.brORpc4	= mux(this.flow.pc4, this.flow.brAddr, this.control.pcSrc);
		this.flow.nextPc	= mux(this.flow.jumpAddr, this.flow.brORpc4, this.control.jump);


	}

	function execute(){
		regRead();
		jumpCalc();
	}

	/**
	 * 32 bit ALU operations.
	 */
	function add(){

	}



	/** Prints all the registers */
	this.printRegisters = function (){
		console.log("pc: \t"+ this.pc);
		console.log("hi: \t"+ this.hi);
		console.log("lo: \t"+ this.lo);
		for(var i=0; i<this.reg.length;i++){
			console.log("reg["+i+"]: \t"+ this.reg[i]);
		}
	};

	function control(){

	}
	/** Starts the cpu once registers and instruction/data memory are loaded. */
	this.run = function (){
		while (true){
			console.log("RUNNING");

			fetch();
			decode();
			execute();

			break;
		}
		this.printRegisters();
	};
}
