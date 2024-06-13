
// TODO
/*
- make sure quotations work correctly
- test to make sure things work with some examples
*/
var myFunction = function () {
  var box = document.getElementById("w3review");
  var boxstring = box.value;
  var arrows = [];
  var realarrows = [];
  var starts = [];
  var elements = []; // element type + stuff inside <>
  var content = []; // whether an element has text inside it or not ("content")
  var contentINNERChecker = [];
  var layers = []; // layer of each element
  var elementNames = [];
  var parents = []; // tells the position of the parent element
  var Instructions = [];
  var elementUses = []; // tells how many of each type of element there currently is in the code
  var tempInstruct = [];
  var currentlayer = 0;
  console.log(boxstring);
  var inlineModifierElements = ["a", "abbr", "b", "bdi", "bdo", "br", "button", "cite", "code", "del", "dfn", "em", "i", "ins", "kbd", "mark", "output", "q", "s", "samp", "small", "span", "strong", "sub", "sup", "time", "var", "wbr", "u"];
  var singleElements = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
  var sometimesSingleElements = ["option"];
  /*
  Use styleList and InstructList for attributes(Ex: class="title" inside a div element).
  Each item of styleList corespondes to the matching item(same index) in InstructList.
  */

  
  var styleList = ["class=", "id=", "type=", "value=", "href=", "src=", "onclick=", "width=", "height=", "controls"];
  var InstructList = ['[elem878!4].setAttribute("class", "[demo878!4]");', '[elem878!4].id = "[demo878!4]";', '[elem878!4].type = "[demo878!4]";', '[elem878!4].value = "[demo878!4]";', '[elem878!4].href = "[demo878!4]";', '[elem878!4].src = "[demo878!4]";', '[elem878!4].onclick = function() { [demo878!4] };', '[elem878!4].setAttribute("width", [demo878!4]);', '[elem878!4].setAttribute("height", [demo878!4]);', '[elem878!4].setAttribute("controls", true);'];
  /* ------------- Adding to These Example -------------

  styleList.push("id=");
  InstructList.push('[elem878!4].id = "[demo878!4]";');

  (-) [elem878!4].id = "[demo878!4]";   ---->   comes from element.id = "[id here]";
  */

  var checkIfElementIsSingle = function (tempj, start) {
    // returns 1 if it's not single
    // returns 0 if it's a single
    var newtempj = tempj;
    var elementType = elements[tempj][0];
    if (singleElements.includes(elements[tempj][0])) {
      return 0;
    }
    if (sometimesSingleElements.includes(elementType) === true) {
      var tempchecker = 0;
      for (var k = start; k < realarrows.length; k++) {
        if (realarrows[k] === "</" + elementType + ">") { // checks if it has an endtag
          tempchecker = 1;
          console.log("endtag: "+ realarrows[k]);
          break;
        } else if (elements[newtempj][0] === elementType) { // checks for more of the same type
          console.log("next same element: " + elements[newtempj][0]);
          break;
        }
        if (realarrows[k].charAt(1) != "/") {
          newtempj++;
        }
      }
      return tempchecker;
    } else {
      return 1;
    }

  }
  var arrowtest = -1;
  var tempj = 0;
  var tempnum = 0;
  var highestlayer = 0;
  var num11 = 0;
  for (var i = 0; i < boxstring.length; i++) {
    if (boxstring[i] == "<") {
      arrowtest = i;
    }
    if (arrowtest > -1 && boxstring[i] == ">") {
      arrows.push([arrowtest, i]);
      arrowtest = -1;
    }
  }
  var curstring = "";
  for (var i = 0; i < arrows.length; i++) {
    for (var j = 0; j <= (arrows[i][1] - arrows[i][0]); j++) {
      curstring = curstring + boxstring[j + arrows[i][0]];
    }
    realarrows.push(curstring);
    curstring = "";
  }
  
  for (var i = 0; i < realarrows.length; i++) {
    if (realarrows[i].charAt(1) != "/") {
      starts.push([realarrows[i], i]);
    }
  }
  var j = 0;
  for (var i = 0; i < starts.length; i++) {
    j = 1;
    tempstring = "";
    tempstring2 = "";
    while (j != -1) {
      if (starts[i][0].charAt(j) == " " || starts[i][0].charAt(j) == ">") {
        break;
      }
      tempstring = tempstring + starts[i][0].charAt(j);
      j++;
    }
    if (starts[i][0].charAt(j) == " ") {
      j++;
    }
    while (starts[i][0].charAt(j) != ">") {
      tempstring2 = tempstring2 + starts[i][0].charAt(j);
      j++;
    }
    elements.push([tempstring, tempstring2]);
  }
  /*
  ------------------ Inline Modifier Steps ------------------
  1.) Search and find an inline modifier
  2.) Check if one of these is met:
    - next tag is the element's endtag (</>)    [condition #1]
    - stuff inbetween tag and the endtag is just modifiers      [condition #2]
  3.) if true, then determine if modifier is inside another element(all of these condiditions are true):
    - tag to the left is not a single element or an endtag (</>). If so find the element type of that tag.  [condition #3]
    - look at the tags to the right until you find the endtag for the element that was to the left. All
    elements inbewteen must be modifiers           [condition #4]
  4.) If true, remove modifier from realarrows, element, arrows
  5.) Add index of parent element(element to left) to contentchecklist if not already in there

  */
  var findModifiers = function () {
    var tempArrowNum = realarrows.length
    tempj = 0;
    for (var i = 0; i < tempArrowNum; i++) {
      var testmodifiers = 0;
      if (realarrows[i].charAt(1) != "/") { 
        if (inlineModifierElements.includes(elements[tempj][0])) {
          if (realarrows[i + 1] === ("</" + elements[tempj][0] + ">") || singleElements.includes(elements[tempj][0])) { // if next tag(stuff inside/including <>) is the </>      #1
            testmodifiers = 1;
          } else {
            var j = i + 1;
            var newtempj = tempj + 1;
            testmodifiers = 1;
            while (j < tempArrowNum) { // checks if only modifiers/text is inside a modifier element     #2
              if (realarrows[j] == "</" + elements[tempj][0] + ">") {
                break;
              } else if (realarrows[j].charAt(1) != "/" && inlineModifierElements.includes(elements[newtempj][0]) === false) {
                testmodifiers = 0;
                break;
              }
              if (realarrows[j].charAt(1) != "/") {
                newtempj++;
              }
              j++;
            }
          }
          if (testmodifiers === 1) { // #1 or #2 are met
            if (tempj > 0) {
              if (realarrows[i - 1].charAt(1) != "/" &&  singleElements.includes(elements[tempj - 1][0]) === false) { // check sometimesSingle also     #3
                var tempi = i + 1;
                var newtempj = tempj + 1;
                var parentElementType = elements[tempj - 1][0];
                if (singleElements.includes(elements[tempj][0]) == false) {
                  tempi++;
                }
                testmodifiers = 0;
                for (var k = tempi; k < tempArrowNum; k++) { // #4
                  if (realarrows[k] === "</" + parentElementType + ">") {
                    testmodifiers = 1;
                    break;
                  } else if (realarrows[k].charAt(1) != "/" && inlineModifierElements.includes(elements[newtempj][0]) === false) {
                    break;
                  }
                  if (realarrows[k].charAt(1) != "/") {
                    newtempj++;
                  }
                }
                if (testmodifiers === 1) { // #3 and #4 are met
                  console.log("remove:" + elements[tempj][0]);
                  if (singleElements.includes(elements[tempj][0]) === false) {
                    for (var j = i + 1; j < tempArrowNum; j++) {
                      if (realarrows[j] === ("</" + elements[tempj][0] + ">")) {
                        realarrows.splice(j, 1);
                        arrows.splice(j, 1);
                      }
                    }
                    realarrows.splice(i, 1);
                    arrows.splice(i, 1);
                  } else {
                    realarrows.splice(i, 1);
                    arrows.splice(i, 1);
                  }
                  elements.splice(tempj, 1);
                  tempArrowNum = realarrows.length;
                  if (contentINNERChecker.includes(tempj - 1) === false) {
                    contentINNERChecker.push(tempj - 1);
                  }
                  i--;
                  tempj--;
                }
              }
            }
          }
        }
        tempj++;
      }
    }
  }
  findModifiers();
  tempj = 0;
  for (var i = 0; i < realarrows.length; i++) {
    if (realarrows[i].charAt(1) != "/") {
      if (((i + 1) < realarrows.length && realarrows[i + 1].charAt(1) != "/") || checkIfElementIsSingle(tempj, i + 1) === 0) {
        content.push("N/A"); 
      } else {
        tempstring = "";
        if ((i + 1) < realarrows.length) {
          for (var j = 1; j < (arrows[i + 1][0] - arrows[i][1]); j++) {
            tempstring = tempstring + boxstring[j + arrows[i][1]];
          }
          if (tempstring.length > 0) {
            content.push(tempstring);
          } else {
            content.push("N/A");
          }
        }
      }
      tempj++;
    }
  }
  tempj = 0;
  for (var i = 0; i < realarrows.length; i++) {
    if (realarrows[i].charAt(1) == "/") {
      currentlayer--;
    } else {
      layers.push(currentlayer);
      currentlayer++;
      if (currentlayer > highestlayer) {
        highestlayer = currentlayer;
      }
      if (checkIfElementIsSingle(tempj, i + 1) === 0) {
        currentlayer--;
      }
      tempj++;
    }
  }
  if (highestlayer > 0) {
    highestlayer--;
  }
  for (var i = 0; i < elements.length; i++) {
    tempnum = 1;
    for (j = i - 1; j >= 0; j--) {
      if (layers[i] > layers[j]) {
        parents.push(j);
        j = 0;
        tempnum = 0;
      }
    }
    if (tempnum === 1) {
      parents.push("N/A");
    }
  }
  
  while (highestlayer != -1) {
    for (var i = 0; i < layers.length; i++) {
      if (layers[i] === highestlayer) {
        if (elementUses[elements[i][0]] === undefined) { 
          elementUses[elements[i][0]] = 1;
        } else {
          elementUses[elements[i][0]]++;
        }
        elementNames[i] = (elements[i][0] + elementUses[elements[i][0]]);
        for (var k = 0; k < styleList.length; k++) {
          if (elements[i][1].indexOf(styleList[k]) >= 0) {
            var num10 = elements[i][1].indexOf(styleList[k]) + styleList[k].length + 1;
            tempstring = "";
            if (styleList[k].includes("=")) {
              for (var j = 0; j > -1; j++) {
                if (elements[i][1].charAt(num10 + j) === '"') {
                  j = -10;
                } else {
                tempstring = tempstring + elements[i][1].charAt(num10 + j);
                }
              }
            }
            tempstring2 = InstructList[k];
            if (tempstring2.includes("[elem878!4]")) {
              tempstring2 = tempstring2.replace("[elem878!4]", elements[i][0] + elementUses[elements[i][0]])
            }
            /*
  ------------------------------------  SPECIAL ATTRIBUTES ------------------------------------ 

  If there are special cases then you will have to add them here.
  
  */
            
            if (tempstring2.includes("[demo878!4]")) {
              tempstring2 = tempstring2.replace("[demo878!4]", tempstring);
            } 
            
            
  /* 
  ------------------------------------  END OF SPECIAL ATTRIBUTES ------------------------------------

  */
            Instructions.unshift(tempstring2);
          }
        }
        if (content[i] != "N/A") {
          if (contentINNERChecker.includes(i) === false) {
            if (elementUses["node"] === undefined) { 
              elementUses["node"] = 1;
            } else {
              elementUses["node"]++;
            }
            Instructions.unshift(elements[i][0] + elementUses[elements[i][0]] +".appendChild(node" + elementUses["node"] +");");
            Instructions.unshift("const node" + elementUses["node"] + " = document.createTextNode(" + '"' + content[i] + '"' +");");
          } else {
            Instructions.unshift(elements[i][0] + elementUses[elements[i][0]] + ".innerHTML = " + "'" + content[i] + "';");
          }
        }
        Instructions.unshift("const " + elements[i][0] + elementUses[elements[i][0]] + " = document.createElement(" + '"' + elements[i][0] + '"' +");");
        if (highestlayer != 0) {
          tempInstruct.push("Fill!5$404:" + parents[i] + "," + elements[i][0] + elementUses[elements[i][0]])
        } else {
          tempInstruct.push("element.appendChild(" + elements[i][0] + elementUses[elements[i][0]] + ");");
        }
      }
    }
    highestlayer--;
  }
  for (var i = 0; i < tempInstruct.length; i++) {
    if (tempInstruct[i].includes("Fill!5$404:")) {
      tempstring = "[parn878!4].appendChild([elem878!4]);";
      num11 = ("Fill!5$404:").length;
      tempstring2 = "";
      for (var j = 0; j > -1; j++) {
        if (tempInstruct[i].charAt(num11 + j) === ",") {
          j = -10;
        } else {
        tempstring2 = tempstring2 + tempInstruct[i].charAt(num11 + j);
        }
      }
      tempnum = Number(tempstring2);
      tempstring = tempstring.replace("[parn878!4]", elementNames[tempnum]);
      num11 = tempInstruct[i].indexOf(",");
      tempstring2 = "";
      for (var j = 1; j > -1; j++) {
        if (num11 + j === tempInstruct[i].length) {
          j = -10;
        } else {
        tempstring2 = tempstring2 + tempInstruct[i].charAt(num11 + j);
        }
      }
      tempstring = tempstring.replace("[elem878!4]", tempstring2);
      tempInstruct[i] = tempstring;
    }
  }
  for (var i = 0; i < tempInstruct.length; i++) {
    Instructions.push(tempInstruct[i]);
  }
  if (Instructions.length > 0) {
    const codeh3 = document.getElementById("h3");
    codeh3.innerHTML = "Generated Code";
  }
  for (var i = 0; i < Instructions.length; i++) {
    const box = document.getElementById("box");
    const p1 = document.createElement("p");
    const node = document.createTextNode(Instructions[i]);    
    p1.appendChild(node);
    box.appendChild(p1);
  }
  
  
  
  
}


