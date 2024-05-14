var myFunction = function () {
    var box = document.getElementById("w3review");
    var boxstring = box.value;
    var arrows = [];
    var realarrows = [];
    var starts = [];
    var elements = []; // element type + stuff inside <>
    var content = []; // wether an element has text inside it or not ("content")
    var layers = []; // layer of each element
    var elementNames = [];
    var parents = []; // tells the position of the parent element
    var Instructions = [];
    var elementUses = []; // tells how many of each type of element there currently is in the code
    var tempInstruct = [];
    
    
    var currentlayer = 0;
    console.log(boxstring);
    var error = 0;
    var errorlist = ["<abbr>", "<br>", "<ins>", "<cite>", "<del>", "<dfn>"];
    var singleElements = ["area", "base", "col", "embed", "img", "input", "link", "meta", "option", "source"];
    var styleList = ["class=", "id=", "type=", "value="];
    var InstructList = ['[elem878!4].classList.add("[demo878!4]", "[demo878!4]2");', '[elem878!4].id = "[demo878!4]";', '[elem878!4].type = "[demo878!4]";', '[elem878!4].value = "[demo878!4]";'];
    var arrowtest = -1;
    var tempj = 0;
    var tempnum = 0;
    var highestlayer = 0;
    var num11 = 0;
    for (var i = 0; i < errorlist.length; i++) {
      if (boxstring.includes(errorlist[i])) {
        console.log("Code can't contain: " + errorlist[i])
        error = 1;
      }
    }
    if (error == 0) {
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
    for (var i = 0; i < realarrows.length; i++) {
      if (realarrows[i].charAt(1) != "/") {
        if ((i + 1) < realarrows.length && realarrows[i + 1].charAt(1) != "/") {
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
      }
    }
    
    tempj = 0;
    for (var i = 0; i < realarrows.length; i++) {
      if (realarrows[i].charAt(1) == "/") {
        currentlayer--;
      } else {
        layers.push(currentlayer);
        if (singleElements.includes(elements[tempj][0]) === false) {
          currentlayer++;
          if (currentlayer > highestlayer) {
            highestlayer = currentlayer;
          }
        }
        tempj++;
      }
    }
    highestlayer--;
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
              for (var j = 0; j > -1; j++) {
                if (elements[i][1].charAt(num10 + j) === '"') {
                  j = -10;
                } else {
                tempstring = tempstring + elements[i][1].charAt(num10 + j);
                }
              }
              tempstring2 = InstructList[k];
    /*
    ------------------------------------  MODIFIERS  ------------------------------------
    
    This is where you can Modify the parts within the HTML element (code section below)
    
    */
              if (tempstring2.includes("[elem878!4]")) {
                tempstring2 = tempstring2.replace("[elem878!4]", elements[i][0] + elementUses[elements[i][0]])
              }
              if (tempstring2.includes("classList")) {
                  if (tempstring.includes(" ")) {
                  var classTempString1 = tempstring.slice(0, tempstring.indexOf(" "));
                  var classTempString2 = tempstring.slice(tempstring.indexOf(" "), tempstring.length);
                  tempstring2 = tempstring2.replace("[demo878!4]", classTempString1);
                  tempstring2 = tempstring2.replace("[demo878!4]2", classTempString2);
                  } else {
                    tempstring2 = tempstring2.replace("[demo878!4]", tempstring);
                    tempstring2 = tempstring2.replace(', "[demo878!4]2"', "");
                  }
              } else {
                tempstring2 = tempstring2.replace("[demo878!4]", tempstring); 
              }
              // end of modifiers
              Instructions.unshift(tempstring2);
            }
          }
          if (content[i] != "N/A") {
            if (elementUses["node"] === undefined) { 
              elementUses["node"] = 1;
            } else {
              elementUses["node"]++;
            }
            Instructions.unshift(elements[i][0] + elementUses[elements[i][0]] +".appendChild(node" + elementUses["node"] +");");
            Instructions.unshift("const node" + elementUses["node"] + " = document.createTextNode(" + '"' + content[i] + '"' +");");
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
    }

















/* <h2> 2023 - 2024 </h2>
        <div class="flexbox">
            <div class="team">
                <p class="title">President</p>
                <p>Graham Bond</p>
            </div>
            <div class="team">
                <p class="title">Vice President</p>
                <p>Luke Sanders</p>
            </div>
            <div class="team">
                <p class="title">Team Leads</p>
                <p>Logan Frommelt</p>
                <p>Michael Mischkot</p>
                <p>Landon Toler</p>
            </div>
        </div>
        <div class="gap"></div>
        <div class="flexbox">
            <div class="team">
                <p class="title2">Design Proposal</p>
                <p>2nd / 149</p>
            </div>
            <div class="team">
                <p class="title2">Design Report</p>
                <p>TBD</p>
            </div>
            <div class="team">
                <p class="title2">Fly-Off</p>
                <p>TBD</p>
            </div>
        </div>
        <div class="gap"></div>
        <h3 class="update_title">Updates</h3>
        <h3> Mizzou AeroTigers Co. founded as a 501(c)(3) nonprofit corporation</h3>
        <div class="gap"></div> */