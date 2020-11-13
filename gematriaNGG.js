var catArr = []; gemArr = []
var cipherArray = [];
var openCiphers = ["English Ordinal", "Full Reduction", "Reverse Ordinal", "Reverse Full Reduction"]
var ciphersOn = []; allCiphers = []; sHistory = []
var opt_NumCalculation = "Reduced"
var primeArr = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 
103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251]
var ignoreArr = [1456, 1457, 1458, 1459, 1460, 1461, 1462, 1463, 1464, 1465, 1466, 1467, 1468, 1469, 1470, 1471, 1472, 1473]

function Gem_Launch() {
	Set_Categories()
	Build_Ciphers()
	//Load_Options(false)
}

class cipher {
	constructor(impName, impOrder, impR, impG, impB, impMod1 = "", impMod2 = "", impMod3 = "", impMod4 = "", impMod5 = "") {
		var x, y, xMod
		var impMods = []
		this.cArr = []; this.cArr2 = []; this.cArr3 = []
		this.vArr = []; this.vArr2 = []; this.vArr3 = []
		this.Nickname = impName; this.cp = []; this.cv = []; this.sumArr = []; this.RGB = []
		impMods[0] = impMod1
		impMods[1] = impMod2
		impMods[2] = impMod3
		impMods[3] = impMod4
		impMods[4] = impMod5
		this.RGB = [impR, impG, impB]

		switch (impOrder) {
			case "English":
				for (y = 0; y < 26; y++) {
					this.cArr[y] = (y + 97)
					this.cArr2[y] = (y + 65)
				}
				Build_GemVals(this)
				break;
			case "Jewish":
				this.cArr = [97, 98, 99, 100, 101, 102, 103, 104, 105, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 120, 121, 122, 106, 118, 38, 119]
				this.cArr2 = [65, 66, 67, 68, 69, 70, 71, 72, 73, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 88, 89, 90, 74, 86, 38, 87]
				Build_GemVals(this)
				break;
			case "Hebrew G":
				this.cArr = [1488, 1489, 1490, 1491, 1492, 1493, 1494, 1495, 1496, 1497, 1499, 1500, 1502, 1504, 1505, 1506, 1508, 1510, 1511, 1512, 1513, 1514, 1498, 1501, 1503, 1507, 1509]
				for (y = 0; y < 22; y++) {
					this.vArr.push(y + 1)
				}
				this.vArr[22] = 11; this.vArr[23] = 13; this.vArr[24] = 14; this.vArr[25] = 17; this.vArr[26] = 18
				break;
			case "Hebrew Soffits":
				this.cArr = [1488, 1489, 1490, 1491, 1492, 1493, 1494, 1495, 1496, 1497, 1499, 1500, 1502, 1504, 1505, 1506, 1508, 1510, 1511, 1512, 1513, 1514, 1498, 1501, 1503, 1507, 1509]
				Build_GemVals(this)
				break;
			case "Greek":
				this.cArr = [913, 914, 915, 916, 917, 988, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 984, 929, 931, 932, 933, 934, 935, 936, 937, 993]
				this.cArr2 = [945, 946, 947, 948, 949, 989, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 985, 961, 963, 964, 965, 966, 967, 968, 969, 993]
				this.cArr3 = [940, 941, 942, 943, 962, 972, 973, 974, 986, 987, 902, 904, 905, 906, 908, 910, 911, 7952, 8000, 8150, 8058, 8166]
				this.vArr3 = [1, 5, 8, 10, 20, 16, 22, 26, 6, 6, 1, 5, 7, 10, 16, 22, 26, 5, 16, 9, 22, 22]
				Build_GemVals(this)
				break;
			case "Chald":
				for (y = 0; y < 26; y++) {
					this.cArr[y] = (y + 97)
					this.cArr2[y] = (y + 65)
				}
				this.vArr = [1, 2, 3, 4, 5, 8, 3, 5, 1, 1, 2, 3, 4, 5, 7, 8, 1, 2, 3, 4, 6, 6, 6, 5, 1, 7]
				this.vArr2 = [1, 2, 3, 4, 5, 8, 3, 5, 1, 1, 2, 3, 4, 5, 7, 8, 1, 2, 3, 4, 6, 6, 6, 5, 1, 7]
				break;
			case "Keypad":
				for (y = 0; y < 26; y++) {
					this.cArr[y] = (y + 97)
					this.cArr2[y] = (y + 65)
				}
				this.vArr = [2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9]
				this.vArr2 = [2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9]
				break;
		}

		if (impMods.indexOf("Exception") > -1) {this.Exception = true}
		if (impMods.indexOf("Reverse") > -1) {this.Reverse_Order()}
		if (impMods.indexOf("SeptenaryNum") > -1) {this.Make_Septenary()}
		if (impMods.indexOf("ALW") > -1) {this.Make_ALW()}
		if (impMods.indexOf("KFW") > -1) {this.Make_KFW()}
		if (impMods.indexOf("LCH") > -1) {this.Make_LCH()}
		if (impMods.indexOf("Bacon") > -1) {this.Make_Bacon()}
		if (impMods.indexOf("Baconis") > -1) {this.Make_Baconis()}
		if (impMods.indexOf("SatanicNum") > -1) {this.Make_Satanic()}
		if (impMods.indexOf("FullReduction") > -1) {this.Reduce_Full()}
		if (impMods.indexOf("SingleReduction") > -1) {this.Reduce_Single()}
		if (impMods.indexOf("Extend") > -1) {this.Extend()}
		if (impMods.indexOf("PrimeNum") > -1) {this.Make_Primes()}
		if (impMods.indexOf("TriangleNum") > -1) {this.Make_Trigonal()}
		if (impMods.indexOf("SquareNum") > -1) {this.Make_Squares()}
		if (impMods.indexOf("SumerianNum") > -1) {this.Make_Sumerian()}
		if (impMods.indexOf("KeyNum") > -1) {this.Make_KeyAlt()}
	}

	Gematria(impVal, impType, wLink = false, impHistory = false) {
		var cIndex, x, z, tStr, GemTotal
		GemTotal = 0; this.cp = []; this.cv = []
		for (x = 0; x < impVal.length; x++) {
			z = impVal.charCodeAt(x);
			cIndex = this.cArr.indexOf(z)
			if (cIndex > -1) {GemTotal += this.vArr[cIndex]} else {
				cIndex = this.cArr2.indexOf(z)
				if (cIndex > -1) {GemTotal += this.vArr2[cIndex]} else {
					cIndex = this.cArr3.indexOf(z)
					if (cIndex > -1) {GemTotal += this.vArr3[cIndex]}
				}
			}
		}

		if (opt_NumCalculation == "Reduced") {
			for (x = 0; x < impVal.length; x++) {
				z = impVal.charCodeAt(x);
				if (z > 47 && z < 58) {
					GemTotal += z - 48
				}
			}
		} else if (opt_NumCalculation == "Full" || NumberArray() == true) {
			var curNum = ""
			var kArr = [48,49,50,51,52,53,54,55,56,57]
			var nArr = [0,1,2,3,4,5,6,7,8,9]
			for (x = 0; x < impVal.length; x++) {
				z = impVal.charCodeAt(x);
				if (kArr.indexOf(z) > -1)  {
					curNum = String(curNum) + String(nArr[kArr.indexOf(z)])
				} else if (curNum.length > 0 && z !== 44) {
					GemTotal += Number(curNum)
					curNum = ""
				}
			}
			if (curNum.length > 0) {
				GemTotal += Number(curNum)
			}
		}

		if (GemTotal > 999999) {
			return ">1 mil"
		} else if (impType == 1) {
			return GemTotal
		} else {
			if (impHistory == false && GemTotal > 0 && GemTotal < 10000000) {
				if (wLink == true || this.Nickname == breakCipher) {
					tStr = '<a href="javascript:Open_Properties(' + GemTotal + ')" onmouseover="javascript:Populate_Breakdown('
					tStr += "'" + this.Nickname + "', false"
					tStr += ')" onmouseout="Populate_Breakdown()">' + GemTotal + '</a>'
				} else if (wLink == "NoHeader" && impHistory == false) {
					tStr = '<a href="javascript:Populate_Breakdown('
					tStr += "'" + this.Nickname + "', true"
					tStr += ')" onmouseover="javascript:cipherHead_mouseOver('
					tStr += "'" + this.Nickname + "', false"
					tStr += ')" onmouseout="Populate_Breakdown()">' + GemTotal + '</a>'
				} else {
					tStr = GemTotal
				}
			} else {
				tStr = GemTotal
			}

			if (impHistory == false && opt_Reduce == true && GemTotal > 0) {
				tStr += '<font style="font-size: 50%"><BR>' + ReducedNum(GemTotal, true) + '</font>'
			}
			return tStr
		}
	}

	Breakdown(impVal) {
		var x, z, cIndex, wordSum
		var lastSpace = true
		
		this.cp = []; this.cv = []; this.curNum = ""; this.LetterCount = 0

		this.sumArr = []; wordSum = 0
		for (x = 0; x < impVal.length; x++) {

			z = impVal.charCodeAt(x);

			if (z > 47 && z < 58) {
				if (opt_NumCalculation == "Full") {
					this.curNum = String(this.curNum) + String(z - 48)
					if (lastSpace == false) {
						this.cp.push(" ")
						this.cv.push(" ")
						this.sumArr.push(wordSum)
						wordSum = 0
						lastSpace = true
					}
				} else if (opt_NumCalculation == "Reduced") {
					this.cp.push("num" + String(z - 48))
					this.cv.push(z - 48)
					this.curNum = String(z - 48)
					wordSum += z - 48
					lastSpace = false
				}

			} else {
				if (opt_NumCalculation == "Full") {
					if (this.curNum.length > 0 & z !== 44) {
						this.cp.push("num" + String(this.curNum), " ")
						this.cv.push(Number(this.curNum), " ")
						this.sumArr.push(Number(this.curNum))
						this.curNum = ""
					}
				}
				
				if (ignoreArr.indexOf(z) == -1) {
					cIndex = this.cArr.indexOf(z)
					if (cIndex > -1) {lastSpace = false; wordSum += this.vArr[cIndex]; this.cp.push(z); this.LetterCount++; this.cv.push(this.vArr[cIndex])} else {
						cIndex = this.cArr2.indexOf(z)
						if (cIndex > -1) {lastSpace = false; wordSum += this.vArr2[cIndex]; this.cp.push(z); this.LetterCount++; this.cv.push(this.vArr2[cIndex])} else {
							cIndex = this.cArr3.indexOf(z)
							if (cIndex > -1) {lastSpace = false; wordSum += this.vArr3[cIndex]; this.cp.push(z); this.LetterCount++; this.cv.push(this.vArr3[cIndex])
							} else if (z !== 39 && lastSpace == false) {
								this.sumArr.push(wordSum)
								wordSum = 0
								this.cp.push(" ")
								this.cv.push(" ")
								lastSpace = true
							}
						}
					}
				}
			}
		}
		if (lastSpace == false) {this.sumArr.push(wordSum)}
		if (this.curNum !== "") {
			if (opt_NumCalculation == "Full") {
				this.cp.push("num" + String(this.curNum))
				this.cv.push(Number(this.curNum))
				this.sumArr.push(Number(this.curNum))
				if (this.sumArr.length > 1) {this.cp.push(" "); this.cv.push(" ")}
			}
		}
		if (this.sumArr.length > 1 && lastSpace == false) {this.cp.push(" "); this.cv.push(" ")}

		this.WordCount = this.sumArr.length
	}

	Make_Bacon() {
		var tempArr = []
		var tempArr2 = []
		var x
		for (x = 0; x < this.vArr.length; x++) {
			tempArr.push(this.vArr[x])
			tempArr2.push(this.cArr[x])
		}
		for (x = 0; x < this.vArr2.length; x++) {
			tempArr.push(this.vArr2[x] + this.cArr2.length)
			tempArr2.push(this.cArr2[x])
		}
		this.vArr2 = []; this.cArr2 = []
		for (x = 0; x < tempArr.length; x++) {
			this.vArr[x] = tempArr[x]
			this.cArr[x] = tempArr2[x]
		}
	}
	Make_Baconis() {
		var tempArr = []
		var tempArr2 = []
		var x
		for (x = 0; x < this.vArr.length; x++) {
			tempArr.push((this.vArr2[x] * 2) - 1)
			tempArr.push(this.vArr[x] * 2)
			tempArr2.push(this.cArr2[x])
			tempArr2.push(this.cArr[x])
		}
		this.vArr2 = []; this.cArr2 = []
		for (x = 0; x < tempArr.length; x++) {
			this.vArr[x] = tempArr[x]
			this.cArr[x] = tempArr2[x]
		}
	}

	Reverse_Order() {
		this.cArr.reverse()
		this.cArr2.reverse()
	}

	Reduce_Full() {
		var x, tDig

		for (x = 0; x < this.vArr.length; x++) {
			tDig = this.vArr[x]
			while (isReduced(tDig, this.Exception) === false) {
				tDig = ReducedNum(tDig)
			}
			this.vArr[x] = tDig
		}

		if (this.vArr2.length > 0) {
			for (x = 0; x < this.vArr2.length; x++) {
				tDig = this.vArr2[x]
				while (isReduced(tDig, this.Exception) === false) {
					tDig = ReducedNum(tDig)
				}
				this.vArr2[x] = tDig
			}
		}

		if (this.vArr3.length > 0) {
			for (x = 0; x < this.vArr3.length; x++) {
				tDig = this.vArr3[x]
				while (isReduced(tDig, this.Exception) === false) {
					tDig = ReducedNum(tDig)
				}
				this.vArr3[x] = tDig
			}
		}
	}

	Reduce_Single() {
		var x, tDig

		for (x = 0; x < this.vArr.length; x++) {
			tDig = this.vArr[x]
			if (isReduced(tDig, this.Exception) === false) {
				this.vArr[x] = ReducedNum(tDig, false, true)
			}
		}
		for (x = 0; x < this.vArr2.length; x++) {
			tDig = this.vArr2[x]
			if (isReduced(tDig, this.Exception) === false) {
				this.vArr2[x] = ReducedNum(tDig, false, true)
			}
		}
		for (x = 0; x < this.vArr3.length; x++) {
			tDig = this.vArr3[x]
			if (isReduced(tDig, this.Exception) === false) {
				this.vArr3[x] = ReducedNum(tDig, false, true)
			}
		}
	}
	Extend() {
		var tDig, numZero, x
		for (x = 0; x < this.vArr.length; x++) {
			tDig = String(this.vArr[x])
			if (tDig > 9) {numZero = Number(tDig.substring(0, 1))} else {numZero = 0}
			while (tDig > 9) {
				tDig = ReducedNum(tDig, false, true)
				if (tDig > 9) {numZero++}
			}
			this.vArr[x] = tDig * (Math.pow(10, numZero))
		}
		for (x = 0; x < this.vArr2.length; x++) {
			tDig = String(this.vArr2[x])
			if (tDig > 9) {numZero = Number(tDig.substring(0, 1))} else {numZero = 0}
			while (tDig > 9) {
				tDig = ReducedNum(tDig, false, true)
				if (tDig > 9) {numZero++}
			}
			this.vArr2[x] = tDig * (Math.pow(10, numZero))
		}
		for (x = 0; x < this.vArr3.length; x++) {
			tDig = String(this.vArr3[x])
			if (tDig > 9) {numZero = Number(tDig.substring(0, 1))} else {numZero = 0}
			while (tDig > 9) {
				tDig = ReducedNum(tDig, false, true)
				if (tDig > 9) {numZero++}
			}
			this.vArr3[x] = tDig * (Math.pow(10, numZero))
		}
	}
	Fold() {
		var x
		if (this.vArr.length = 26) {
			for (x = 13; x < this.vArr.length; x++) {
				this.vArr[x] = 13 - [x - 13]
			}
			if (this.vArr2.length > 0) {
				if (this.vArr2.length = 26) {
					for (x = 13; x < this.vArr2.length; x++) {
						this.vArr2[x] = 13 - [x - 13]
					}
				}
			}
		}
		if (this.vArr.length = 27) {
			for (x = 14; x < this.vArr.length; x++) {
				this.vArr[x] = 13 - [x - 14]
			}
			if (this.vArr2.length > 0) {
				if (this.vArr2.length = 26) {
					for (x = 14; x < this.vArr2.length; x++) {
						this.vArr2[x] = 13 - [x - 14]
					}
				}
			}
		}
	}
	Make_Satanic() {
		var x
		for (x = 0; x < this.vArr.length; x++) {
			this.vArr[x] += 35
		}
		if (this.vArr2.length > 0) {
			for (x = 0; x < this.vArr2.length; x++) {
				this.vArr2[x] += 35
			}
		}
		if (this.vArr3.length > 0) {
			for (x = 0; x < this.vArr3.length; x++) {
				this.vArr3[x] += 35
			}
		}
	}
	Make_ALW() {
		this.cArr = [97, 108, 119, 104, 115, 100, 111, 122, 107, 118, 103, 114, 99, 110, 121, 106, 117, 102, 113, 98, 109, 120, 105, 116, 101, 112]
		this.cArr2 = [65, 76, 87, 72, 83, 68, 79, 90, 75, 86, 71, 82, 67, 78, 89, 74, 85, 70, 81, 66, 77, 88, 73, 84, 69, 80]
	}
	Make_KFW() {
		this.cArr = [107, 102, 119, 114, 109, 100, 121, 116, 97, 118, 113, 104, 99, 120, 111, 106, 101, 108, 103, 98, 115, 110, 105, 122, 117, 112]
		this.cArr2 = [75, 70, 87, 82, 77, 68, 89, 84, 65, 86, 81, 72, 67, 88, 79, 74, 69, 76, 71, 66, 83, 78, 73, 90, 85, 80]
	}
	Make_LCH() {
		var x
		this.cArr = [105, 108, 99, 104, 112, 97, 120, 106, 119, 116, 111, 103, 102, 101, 114, 115, 113, 107, 121, 122, 98, 109, 118, 100, 110, 117]
		this.cArr2 = [73, 76, 67, 72, 80, 65, 88, 74, 87, 84, 79, 71, 70, 69, 82, 83, 81, 75, 89, 90, 66, 77, 86, 68, 78, 85]
		for (x = 0; x < this.cArr.length; x++) {
			this.vArr[x] = x
			this.vArr2[x] = x
		}
	}
	Make_Primes() {
		var x
		for (x = 0; x < this.vArr.length; x++) {
			this.vArr[x] = primeArr[this.vArr[x] - 1]
		}
		if (this.vArr2.length > 0) {
			for (x = 0; x < this.vArr2.length; x++) {
				this.vArr2[x] = primeArr[this.vArr2[x] - 1]
			}
		}
		if (this.vArr3.length > 0) { 
			for (x = 0; x < this.vArr3.length; x++) {
				this.vArr3[x] = primeArr[this.vArr3[x] - 1]
			}
		}
	}
	Make_Trigonal() {
		var x
		this.vArr[0] = 1
		for (x = 0; x < this.vArr.length; x++) {
			this.vArr[x] = this.vArr[x] * (this.vArr[x] + 1) / 2
		}
		if (this.vArr2.length > 0) {
			for (x = 0; x < this.vArr2.length; x++) {
				this.vArr2[x] = this.vArr2[x] * (this.vArr2[x] + 1) / 2
			}
		}
		if (this.vArr3.length > 0) {
			for (x = 0; x < this.vArr3.length; x++) {
				this.vArr3[x] = this.vArr3[x] * (this.vArr3[x] + 1) / 2
			}
		}
	}
	Make_Squares() {
		var x
		for (x = 0; x < this.vArr.length; x++) {
			this.vArr[x] = this.vArr[x] * this.vArr[x]
		}
		if (this.vArr2.length > 0) {
			for (x = 0; x < this.vArr2.length; x++) {
				this.vArr2[x] = this.vArr2[x] * this.vArr2[x]
			}
		}
		if (this.vArr3.length > 0) {
			for (x = 0; x < this.vArr3.length; x++) {
				this.vArr3[x] = this.vArr3[x] * this.vArr3[x]
			}
		}
	}
	Make_Sumerian() {
		var x
		for (x = 0; x < 26; x++) {
			this.vArr[x] = this.vArr[x] * 6
		}
		if (this.vArr2.length > 0) {
			for (x = 0; x < 26; x++) {
				this.vArr2[x] = this.vArr2[x] * 6
			}
		}
		if (this.vArr3.length > 0) {
			for (x = 0; x < 26; x++) {
				this.vArr3[x] = this.vArr3[x] * 6
			}
		}
	}
	Make_Septenary() {
		this.vArr = [1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1]
		if (this.vArr2.length > 0) {
			this.vArr2 = [1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1]
		}
	}
	Make_KeyAlt() {
		this.vArr = [2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 0, 7, 7, 8, 8, 8, 9, 9, 9, 0]
		this.vArr2 = [2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 0, 7, 7, 8, 8, 8, 9, 9, 9, 0]
	}

}

function Build_GemVals(impCipher) {
	var x
	for (x = 0; x < impCipher.cArr.length; x++) {
		impCipher.vArr[x] = (x + 1)
	}
	if (impCipher.cArr2.length > 0) {
		for (x = 0; x < impCipher.cArr2.length; x++) {
			impCipher.vArr2[x] = (x + 1)
		}
	}
}

function Populate_Sums(impVal) {
	var x, gSum
	gemArr = []

	for (x = 0; x < ciphersOn.length; x++) {
		gemArr[x] = ciphersOn[x].Gematria(impVal, 1)
		if (opt_Headers == true) {
			gSum = ciphersOn[x].Gematria(impVal, 2, true)
		} else {
			gSum = ciphersOn[x].Gematria(impVal, 2, "NoHeader")
		}
		document.getElementById(ciphersOn[x].Nickname + "_Sum").innerHTML = gSum
	}
}

function Open_Properties(impNum) {
	if (impNum > 0 && impNum < 10000000) {
		window.open("http://www.gematrinator.com/calculator/numberProperties.php?Number=" + impNum, "Properties of " + impNum, "height=480,width=750")
	}
}

function GetTriangular(impNum) {
	var x
	x = (impNum * (impNum + 1) / 2)
	return x
}

function ReducedNum(impNum, impBool = false, impSingle = false) {
	var x, s
	var cn = 0
	var x, cn

	if (impSingle == true) {
		for (x = 0; x < String(impNum).length; x++) {
			s = Number(String(impNum).slice(x, x + 1))
			cn += s
		}
		return cn
	}

	while (impNum > 9) {
		if (impBool == true) {
			if (impNum == 11 || impNum == 22 || impNum == 33) {
				return impNum
			}
		}
		cn = 0
		for (x = 0; x < String(impNum).length; x++) {
			s = Number(String(impNum).slice(x, x + 1))
			cn += s
		}
		impNum = cn
	}

	return impNum
}
function isReduced(impNum, impOpt = false) {
	if (impNum < 10) {
		return true
	} else if (impOpt === true) {
		if (impNum === 11 || impNum === 22 || impNum === 33) {
			return true
		} else {
			return false
		}
	} else {
		return false
	}
}

function Build_Ciphers() {
	var key

	for (key in cipherArray) {
		switch (key) {
			case "Full Reduction": allCiphers[allCiphers.length] = new cipher(key, "English", 88, 125, 254, "FullReduction"); break;
			case "Single Reduction": allCiphers[allCiphers.length] = new cipher(key, "English", 140, 171, 227, "SingleReduction"); break;
			case "Full Reduction KV": allCiphers[allCiphers.length] = new cipher(key, "English", 97, 195, 244, "FullReduction", "Exception"); break;
			case "Single Reduction KV": allCiphers[allCiphers.length] = new cipher(key, "English", 70, 175, 244, "SingleReduction", "Exception"); break;
			case "English Ordinal": allCiphers[allCiphers.length] = new cipher(key, "English", 0, 186, 0); break;
			case "English Extended": allCiphers[allCiphers.length] = new cipher(key, "English", 218, 226, 0, "Extend"); break;
			case "Francis Bacon": allCiphers[allCiphers.length] = new cipher(key, "English", 150, 244, 77, "Bacon"); break;
			case "Franc Baconis": allCiphers[allCiphers.length] = new cipher(key, "English", 93, 187, 88, "Baconis"); break;
			case "Satanic": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 0, 0, "SatanicNum"); break;

			case "Reverse Full Reduction": allCiphers[allCiphers.length] = new cipher(key, "English", 100, 226, 226, "Reverse", "FullReduction"); break;
			case "Reverse Single Reduction": allCiphers[allCiphers.length] = new cipher(key, "English", 100, 216, 209, "Reverse", "SingleReduction"); break;
			case "Reverse Full Reduction EP": allCiphers[allCiphers.length] = new cipher(key, "English", 101, 224, 194, "Reverse", "FullReduction", "Exception"); break;
			case "Reverse Single Reduction EP": allCiphers[allCiphers.length] = new cipher(key, "English", 110, 226, 156, "Reverse", "SingleReduction", "Exception"); break;
			case "Reverse Ordinal": allCiphers[allCiphers.length] = new cipher(key, "English", 80, 235, 21, "Reverse"); break;
			case "Reverse Extended": allCiphers[allCiphers.length] = new cipher(key, "English", 253, 255, 119, "Reverse", "Extend"); break;
			case "Reverse Francis Bacon": allCiphers[allCiphers.length] = new cipher(key, "English", 163, 255, 88, "Reverse", "Bacon"); break;
			case "Reverse Franc Baconis": allCiphers[allCiphers.length] = new cipher(key, "English", 111, 193, 121, "Reverse", "Baconis"); break;
			case "Reverse Satanic": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 51, 51, "Reverse", "SatanicNum"); break;

			case "Jewish Reduction": allCiphers[allCiphers.length] = new cipher(key, "Jewish", 159, 99, 197, "FullReduction"); break;
			case "Jewish Ordinal": allCiphers[allCiphers.length] = new cipher(key, "Jewish", 154, 121, 227); break;
			case "Jewish": allCiphers[allCiphers.length] = new cipher(key, "Jewish", 153, 102, 255, "Extend"); break;
			//case "Reverse Jewish": allCiphers[allCiphers.length] = new cipher(key, "Jewish", 153, 102, 255, "Reverse", "Extend"); break;

			case "ALW Kabbalah": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 64, 0, "ALW"); break;
			case "KFW Kabbalah": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 88, 0, "KFW"); break;
			case "LCH Kabbalah": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 93, 73, "LCH"); break;

			case "English Sumerian": allCiphers[allCiphers.length] = new cipher(key, "English", 169, 208, 142, "SumerianNum"); break;
			case "Reverse English Sumerian": allCiphers[allCiphers.length] = new cipher(key, "English", 220, 208, 148, "Reverse", "SumerianNum"); break;
			case "Primes": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 204, 111, "PrimeNum"); break;
			case "Trigonal": allCiphers[allCiphers.length] = new cipher(key, "English", 231, 180, 113, "TriangleNum"); break;
			case "Squares": allCiphers[allCiphers.length] = new cipher(key, "English", 228, 216, 96, "SquareNum"); break;
			case "Reverse Primes": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 209, 145, "Reverse", "PrimeNum"); break;
			case "Reverse Trigonal": allCiphers[allCiphers.length] = new cipher(key, "English", 238, 191, 112, "Reverse", "TriangleNum"); break;
			case "Reverse Squares": allCiphers[allCiphers.length] = new cipher(key, "English", 240, 225, 112, "Reverse", "SquareNum"); break;

			case "Septenary": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 153, 77, "SeptenaryNum"); break;
			case "Chaldean": allCiphers[allCiphers.length] = new cipher(key, "Chald", 166, 166, 99); break;
			case "Keypad": allCiphers[allCiphers.length] = new cipher(key, "Keypad", 255, 126, 255); break;
			//case "Telephone-No QZ": allCiphers[allCiphers.length] = new cipher(key, "Telephone", 255, 153, 255, "PhoneNum"); break;

			case "Hebrew Reduction": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 189, 2, "FullReduction"); break;
			case "Hebrew Ordinal": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 209, 36); break;
			case "Hebrew Gematria": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 227, 93, "Extend"); break;
			case "Hebrew Soffits": allCiphers[allCiphers.length] = new cipher(key, "Hebrew Soffits", 255, 251, 156, "Extend"); break;

			/*case "Hebrew Primes": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 189, 2, "PrimeNum"); break;
			case "Hebrew Trigonal": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 189, 2, "TriangleNum"); break;
			case "Hebrew Squares": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 189, 2, "SquareNum"); break;

			case "Hebrew Reverse Reduction": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 189, 2, "FullReduction", "Reverse"); break;
			case "Hebrew Reverse Ordinal": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 209, 36, "Reverse"); break;
			case "Hebrew Reverse Gematria": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 227, 93, "Extend", "Reverse"); break;
			case "Hebrew Reverse Soffits": allCiphers[allCiphers.length] = new cipher(key, "Hebrew Soffits", 255, 251, 156, "Extend", "Reverse"); break;

			case "Hebrew Reverse Primes": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 189, 2, "PrimeNum", "Reverse"); break;
			case "Hebrew Reverse Trigonal": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 189, 2, "TriangleNum", "Reverse"); break;
			case "Hebrew Reverse Squares": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 189, 2, "SquareNum", "Reverse"); break;
*/
			case "Greek Reduction": allCiphers[allCiphers.length] = new cipher(key, "Greek", 156, 201, 171, "FullReduction"); break;
			case "Greek Ordinal": allCiphers[allCiphers.length] = new cipher(key, "Greek", 149, 199, 139); break;
			case "Greek Isopsephy": allCiphers[allCiphers.length] = new cipher(key, "Greek", 139, 200, 163, "Extend"); break;

			/*case "Jewish Reduction Prime": allCiphers[allCiphers.length] = new cipher(key, "Jewish", 159, 99, 197, "FullReduction", "PrimeNum"); break;
			case "Jewish Reduction Trigonal": allCiphers[allCiphers.length] = new cipher(key, "Jewish", 159, 99, 197, "FullReduction", "TriangleNum"); break;
			case "Jewish Reduction Square": allCiphers[allCiphers.length] = new cipher(key, "Jewish", 159, 99, 197, "FullReduction", "SquareNum"); break
*/


		}
	}

	Build_Open_Ciphers()
}

function Set_Categories() {
	catArr = ["English", "Reverse", "Jewish", "Kabbalah", "Mathematical", "Other", "Foreign"]

	cipherArray["English Ordinal"] = "English"
	cipherArray["Full Reduction"] = "English"
	cipherArray["Single Reduction"] = "English"
	cipherArray["Full Reduction KV"] = "English"
	cipherArray["Single Reduction KV"] = "English"
	cipherArray["English Extended"] = "English"
	cipherArray["Francis Bacon"] = "English"
	cipherArray["Franc Baconis"] = "English"
	cipherArray["Satanic"] = "English"

	cipherArray["Reverse Ordinal"] = "Reverse"
	cipherArray["Reverse Full Reduction"] = "Reverse"
	cipherArray["Reverse Single Reduction"] = "Reverse"
	cipherArray["Reverse Full Reduction EP"] = "Reverse"
	cipherArray["Reverse Single Reduction EP"] = "Reverse"
	cipherArray["Reverse Extended"] = "Reverse"
	cipherArray["Reverse Francis Bacon"] = "Reverse"
	cipherArray["Reverse Franc Baconis"] = "Reverse"
	cipherArray["Reverse Satanic"] = "Reverse"

	cipherArray["Jewish Reduction"] = "Jewish"
	cipherArray["Jewish Ordinal"] = "Jewish"	
	cipherArray["Jewish"] = "Jewish"
	//cipherArray["Reverse Jewish"] = "Jewish"
	//cipherArray["Jewish Reduction Prime"] = "Jewish"
	//cipherArray["Jewish Reduction Trigonal"] = "Jewish"
	//cipherArray["Jewish Reduction Square"] = "Jewish"

	cipherArray["ALW Kabbalah"] = "Kabbalah"
	cipherArray["KFW Kabbalah"] = "Kabbalah"
	cipherArray["LCH Kabbalah"] = "Kabbalah"

	cipherArray["English Sumerian"] = "Mathematical"
	cipherArray["Reverse English Sumerian"] = "Mathematical"
	cipherArray["Primes"] = "Mathematical"
	cipherArray["Trigonal"] = "Mathematical"
	cipherArray["Squares"] = "Mathematical"
	cipherArray["Reverse Primes"] = "Mathematical"
	cipherArray["Reverse Trigonal"] = "Mathematical"
	cipherArray["Reverse Squares"] = "Mathematical"

	cipherArray["Septenary"] = "Other"
	cipherArray["Chaldean"] = "Other"
	cipherArray["Keypad"] = "Other"
	//cipherArray["Telephone-No QZ"] = "Other"

	cipherArray["Hebrew Reduction"] = "Foreign"
	cipherArray["Hebrew Ordinal"] = "Foreign"
	cipherArray["Hebrew Gematria"] = "Foreign"
	cipherArray["Hebrew Soffits"] = "Foreign"

	cipherArray["Hebrew Reduction"] = "Foreign"
	cipherArray["Hebrew Ordinal"] = "Foreign"
	cipherArray["Hebrew Gematria"] = "Foreign"
	cipherArray["Hebrew Soffits"] = "Foreign"
	/*cipherArray["Hebrew Primes"] = "Foreign"
	cipherArray["Hebrew Trigonal"] = "Foreign"
	cipherArray["Hebrew Squares"] = "Foreign"
	cipherArray["Hebrew Reverse Reduction"] = "Foreign"
	cipherArray["Hebrew Reverse Ordinal"] = "Foreign"
	cipherArray["Hebrew Reverse Gematria"] = "Foreign"
	cipherArray["Hebrew Reverse Soffits"] = "Foreign"
	cipherArray["Hebrew Reverse Primes"] = "Foreign"
	cipherArray["Hebrew Reverse Trigonal"] = "Foreign"
	cipherArray["Hebrew Reverse Squares"] = "Foreign"*/
	
	cipherArray["Greek Reduction"] = "Foreign"
	cipherArray["Greek Ordinal"] = "Foreign"
	cipherArray["Greek Isopsephy"] = "Foreign"
}

function Add_Cipher(impName, impBool = true) {
	var x, q

	q = 0
	for (x = 0; x < allCiphers.length; x++) {
		if (allCiphers[x].Nickname == impName) {
			openCiphers.splice(q, 0, impName)
		} else if (openCiphers.indexOf(allCiphers[x].Nickname) > -1) {
			q++
		}
	}

	Build_Open_Ciphers()

	if (impBool == true) {breakCipher = impName; Populate_Breakdown()}
}
function Remove_Cipher(impName) {
	var x

	x = openCiphers.indexOf(impName)
	if (x > -1) {
		openCiphers.splice(x, 1)
	}
	Build_Open_Ciphers()
	if (breakCipher == impName) {
		if (openCiphers.length > 0) {breakCipher = openCiphers[0]} else {breakCipher = ""}
		Populate_Breakdown()
	}
}
function Add_AllCiphers(impBool = false) {
	var x, q, cN, z

	for (x = 0; x < allCiphers.length; x++) {
		q = 0
		cN = allCiphers[x].Nickname
		if (openCiphers.indexOf(cN) == -1 && cN.indexOf("Hebrew") == -1 && cN.indexOf("Greek") == -1) {
			for (z = 0; z < allCiphers.length; z++) {
				if (allCiphers[z].Nickname == cN) {
					openCiphers.splice(q, 0, cN)
					break;
				} else if (openCiphers.indexOf(allCiphers[z].Nickname) > -1) {
					q++
				}
			}
		}
	}

	Build_Open_Ciphers()
	if (impBool == true) {
		Open_Ciphers()
	} else {
		Populate_MenuBar()
	}
}
function Add_BaseCiphers(impBool = false) {
	var x, q, cN, z
	var baseCiphers = ["English Ordinal", "Full Reduction", "Reverse Ordinal", "Reverse Full Reduction"]

	openCiphers = []
	for (z = 0; z < allCiphers.length; z++) {
		if (baseCiphers.indexOf(allCiphers[z].Nickname) > -1) {
			openCiphers.push(allCiphers[z].Nickname)
		}
	}

	Build_Open_Ciphers()
	if (impBool == true) {
		Open_Ciphers()
	} else {
		Populate_MenuBar()
	}
}
function FindSpot(impName) {
	for (x = 0; x < allCiphers.length; x++) {
		if (allCiphers[x].Nickname == impName) {
			return x;
		}
	}
}

function Slide_Cipher(impDir) {
	var x, y, z, q, tempCipher

	if (breakCipher == "") {return;}

	x = FindSpot(breakCipher)
	q = openCiphers.indexOf(breakCipher)
	if (impDir == "up") {
		if (q > 0) {openCiphers.splice(q, 1); openCiphers.splice(q - 1, 0, breakCipher)}
	} else {
		if (q !== openCiphers.length - 1) {openCiphers.splice(q, 1); openCiphers.splice(q + 1, 0, breakCipher)}
	}

	switch (impDir.toLowerCase()) {
		case "up":
			for (z = x - 1; z > -1; z--) {
				if (isCipherOn(allCiphers[z].Nickname) > -1) {
					allCiphers.splice(z, 0, allCiphers[x])
					allCiphers.splice(x + 1, 1)
					break;
				}
			}
			break;
		case "down":
			for (z = x + 1; z < allCiphers.length; z++) {
				if (isCipherOn(allCiphers[z].Nickname) > -1) {
					allCiphers.splice(z + 1, 0, allCiphers[x])
					allCiphers.splice(x, 1)
					break;
				}
			}
			break;
	}

	RestoreField()
	Build_Open_Ciphers()
}

function Build_Open_Ciphers() {
	var x, z

	ciphersOn = []

	for (x = 0; x < openCiphers.length; x++) {
		for (z = 0; z < allCiphers.length; z++) {
			if (allCiphers[z].Nickname == openCiphers[x]) {
				ciphersOn[ciphersOn.length] = allCiphers[z]
				break;
			}
		}
	}

	Build_Table(opt_Headers)
}

function Load_Options(ApplyOptions = false) {
	qString = "http://www.gematrinator.com/usersettings/viewIP.php"
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
	  		respText = xhttp.responseText
	  		if (ApplyOptions == true) {
	  			ParseText()
	  		} else {
				if (respText !== "New Record Added" && respText !== "Error") {
					opt_InTable = true
					Populate_MenuBar()
				} else {
					opt_InTable = false
				}
	  		}
		}
	}

	xhttp.open("GET", qString, true);
	xhttp.send();
}

function ParseText() {
	var tempArr = []; tempCiphers = []
	var x

	openCiphers = []

	if (respText !== "New Record Added" && respText !== "Error") {
		tempArr = respText.split(":;")

		tempCiphers = tempArr[0].split("|")
		sHistory = tempArr[1].split("|")
		if (sHistory[sHistory.length] == "") {
			sHistory.pop()
		}

		for (x = 0; x < tempCiphers.length; x++) {
			if (openCiphers.indexOf(tempCiphers[x]) === -1) {openCiphers.push(tempCiphers[x])}
		}
		
		if (tempArr[2] == "" || tempArr[2] == null) {
			opt_NumCalculation = "Off"
		} else {
			opt_NumCalculation = tempArr[2]
		}
		if (tempArr[3] == "" || tempArr[3] == null) {
			opt_Breakdown = "Chart"
		} else {
			opt_Breakdown = tempArr[3]
		}
		if (tempArr[4] == "" || tempArr[4] == null) {
			ciphers_per_row = 6
		} else {
			ciphers_per_row = tempArr[4]
		}
		if (tempArr[5] == "false") {opt_Reduce = false} else {opt_Reduce = true}
		if (tempArr[6] == "false") {opt_Quotes = false} else {opt_Quotes = true}
		if (tempArr[7] == "false") {opt_Summ = false} else {opt_Summ = true}
		if (tempArr[8] == "false") {opt_Chart = false} else {opt_Chart = true}
		if (tempArr[9] == "false") {opt_Shortcuts = false} else {opt_Shortcuts = true}
		if (tempArr[10] == "false") {opt_Headers = false} else {opt_Headers = true}
	}

	if (openCiphers.length == 0) {
		openCiphers = ["English Ordinal", "Full Reduction", "Reverse Ordinal", "Reverse Full Reduction"]
	}

	LoadCipherOrder()
	Build_Open_Ciphers()
}

function LoadCipherOrder() {
	var x, z, tC, nC

	for (x = openCiphers.length - 1; x > -1; x--) {
		tC = openCiphers[x]
		for (z = 0; z < allCiphers.length; z++) {
			if (allCiphers[z].Nickname == tC) {
				nC = allCiphers[z]
				allCiphers.splice(z, 1)
				allCiphers.splice(0, 0, nC)
			}
		}
	}
}