/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 94.01709401709402, "KoPercent": 5.982905982905983};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.37083333333333335, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://gitgithub.andreregino.com.br/-15"], "isController": false}, {"data": [0.0, 500, 1500, "https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://gitgithub.andreregino.com.br/-14"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://gitgithub.andreregino.com.br/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://gitgithub.andreregino.com.br/-17"], "isController": false}, {"data": [0.5, 500, 1500, "https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://gitgithub.andreregino.com.br/-16"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://gitgithub.andreregino.com.br/-11"], "isController": false}, {"data": [0.0, 500, 1500, "https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://gitgithub.andreregino.com.br/-10"], "isController": false}, {"data": [0.0, 500, 1500, "https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://gitgithub.andreregino.com.br/-13"], "isController": false}, {"data": [0.5, 500, 1500, "https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://gitgithub.andreregino.com.br/-12"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-5"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-12"], "isController": false}, {"data": [0.0, 500, 1500, "https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-13"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-10"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-11"], "isController": false}, {"data": [0.5, 500, 1500, "https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://gitgithub.andreregino.com.br/-18"], "isController": false}, {"data": [0.0, 500, 1500, "https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-14"], "isController": false}, {"data": [0.0, 500, 1500, "https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-15"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222"], "isController": false}, {"data": [0.5, 500, 1500, "https://tracking-api.hotmart.com/rest/track?hotid=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIiwicGFnZXZpZXdfaWQiOiJQVjR6eG5uMW56Y2FrdHh6dzdxOCIsInRyYWNlX2lkIjoiTFRtc3o3Y2huNmQ4a3R4enc4a2QifQ==&cid=1627280424476891769295568189300&bid=1627280424476891769295568189300&sid=cf37ac6af0ff41fdba75628d4ce14620&locationHref=https%3A%2F%2Fgitgithub.andreregino.com.br%2F&account=dde24088-9b16-367b-b10c-d2a86f72dcb4"], "isController": false}, {"data": [0.0, 500, 1500, "https://launcher.hotmart.com/rest/v1/module/load-js?hotid=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZjaGVja291dC5ob3RtYXJ0LmNvbSUyRlI1NDYzODc4MUIlM0ZjaGVja291dE1vZGUlM0QxMiUyNl9oaSUzRGV5SmphV1FpT2lJeE5qSTNNamd3TkRJME5EYzJPRGt4TnpZNU1qazFOVFk0TVRnNU16QXdJaXdpWW1sa0lqb2lNVFl5TnpJNE1EUXlORFEzTmpnNU1UYzJPVEk1TlRVMk9ERTRPVE13TUNJc0luTnBaQ0k2SW1ObU16ZGhZelpoWmpCbVpqUXhabVJpWVRjMU5qSTRaRFJqWlRFME5qSXdJaXdpYkc5allYUnBiMjVJY21WbUlqb2lhSFIwY0hNbE0wRWxNa1lsTWtabmFYUm5hWFJvZFdJdVlXNWtjbVZ5WldkcGJtOHVZMjl0TG1KeUpUSkdJbjAlMjUzRC4xNjMyMjkxNzc1NDQyJTI2YmlkJTNEMTYzMjI5MTc3NTY1NyIsInBhZ2V2aWV3X2lkIjoiUFY0enhubjFuemNha3R4enc3cTgiLCJ0cmFjZV9pZCI6IkxUMDl2ZmU4eXl6Y2Qza3R4enc3cTgifQ==&locationHref=https%3A%2F%2Fgitgithub.andreregino.com.br%2F&account=dde24088-9b16-367b-b10c-d2a86f72dcb4"], "isController": false}, {"data": [0.5, 500, 1500, "https://gitgithub.andreregino.com.br/-9"], "isController": false}, {"data": [0.0, 500, 1500, "https://gitgithub.andreregino.com.br/-6"], "isController": false}, {"data": [0.0, 500, 1500, "https://gitgithub.andreregino.com.br/"], "isController": false}, {"data": [0.0, 500, 1500, "https://gitgithub.andreregino.com.br/-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://gitgithub.andreregino.com.br/-8"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://gitgithub.andreregino.com.br/-7"], "isController": false}, {"data": [0.0, 500, 1500, "https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-9"], "isController": false}, {"data": [0.5, 500, 1500, "https://gitgithub.andreregino.com.br/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://gitgithub.andreregino.com.br/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://gitgithub.andreregino.com.br/-4"], "isController": false}, {"data": [0.0, 500, 1500, "https://gitgithub.andreregino.com.br/-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 117, 7, 5.982905982905983, 3425.495726495726, 78, 22080, 1345.0, 8752.600000000004, 14637.999999999984, 21918.359999999993, 2.8891742394310547, 2165.5003831396925, 3.7735931866727577], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://gitgithub.andreregino.com.br/-15", 3, 0, 0.0, 420.0, 316, 603, 341.0, 603.0, 603.0, 603.0, 1.7482517482517483, 103.14173131555944, 0.9475387893356644], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-4", 3, 0, 0.0, 13411.0, 8533, 17365, 14335.0, 17365.0, 17365.0, 17365.0, 0.12996014555536303, 426.11380752090196, 0.8028592585773696], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-14", 3, 0, 0.0, 222.0, 181, 271, 214.0, 271.0, 271.0, 271.0, 1.667593107281823, 35.113908768760425, 0.8777662937743191], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-3", 3, 0, 0.0, 496.3333333333333, 195, 830, 464.0, 830.0, 830.0, 830.0, 0.38580246913580246, 0.6418738345550412, 0.20495756172839508], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-0", 3, 0, 0.0, 964.6666666666666, 660, 1253, 981.0, 1253.0, 1253.0, 1253.0, 2.3942537909018355, 56.64374251795691, 1.1947887569832403], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-17", 3, 0, 0.0, 195.33333333333334, 158, 226, 202.0, 226.0, 226.0, 226.0, 2.071823204419889, 8.479502978245856, 1.0925630179558012], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-2", 3, 0, 0.0, 2460.6666666666665, 464, 5975, 943.0, 5975.0, 5975.0, 5975.0, 0.23218017181332715, 17.522725238952095, 0.1269735314604133], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-16", 3, 0, 0.0, 209.33333333333334, 176, 239, 213.0, 239.0, 239.0, 239.0, 1.7942583732057418, 4.92019288277512, 0.9602085825358853], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-1", 3, 0, 0.0, 1576.3333333333333, 713, 2092, 1924.0, 2092.0, 2092.0, 2092.0, 0.3910323253388947, 123.23615399341763, 0.32229617440041713], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-11", 3, 0, 0.0, 261.6666666666667, 163, 361, 261.0, 361.0, 361.0, 361.0, 1.4464802314368372, 6.6814956002892965, 0.776918093056895], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-8", 3, 0, 0.0, 3754.6666666666665, 2069, 5943, 3252.0, 5943.0, 5943.0, 5943.0, 0.22021581149526537, 70.10303691367541, 0.11806492237392645], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-10", 3, 0, 0.0, 200.0, 167, 228, 205.0, 228.0, 228.0, 228.0, 1.3032145960034753, 6.135544499348392, 0.7012414476542137], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-7", 3, 0, 0.0, 7489.0, 3303, 10770, 8394.0, 10770.0, 10770.0, 10770.0, 0.18192844147968465, 201.02044562992725, 0.09753780700424501], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-13", 3, 0, 0.0, 728.6666666666666, 495, 892, 799.0, 892.0, 892.0, 892.0, 1.359311282283643, 117.49812386724061, 0.7234615711372905], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-6", 3, 0, 0.0, 849.6666666666666, 96, 1936, 517.0, 1936.0, 1936.0, 1936.0, 0.3376477208778841, 1.3189364096792346, 0.18102402222847497], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-12", 3, 0, 0.0, 267.3333333333333, 195, 330, 277.0, 330.0, 330.0, 330.0, 1.467710371819961, 30.072296202299412, 0.7883210004892368], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-5", 3, 0, 0.0, 3598.0, 1040, 6766, 2988.0, 6766.0, 6766.0, 6766.0, 0.21875455738661223, 79.39914560394487, 0.13672159836663264], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-12", 3, 0, 0.0, 2619.0, 1257, 4265, 2335.0, 4265.0, 4265.0, 4265.0, 0.2070393374741201, 26.347373188405797, 0.11100058229813664], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-13", 3, 1, 33.333333333333336, 9708.666666666666, 7689, 10866, 10571.0, 10866.0, 10866.0, 10866.0, 0.1427483821850019, 197.7742125791064, 0.05102139441377998], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-10", 3, 0, 0.0, 2762.0, 1248, 4153, 2885.0, 4153.0, 4153.0, 4153.0, 0.2018435040032295, 25.22058236055978, 0.10821492548610644], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-11", 3, 0, 0.0, 1333.0, 524, 1910, 1565.0, 1910.0, 1910.0, 1910.0, 0.21068895287590422, 9.076085048107311, 0.11295726086803848], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-0", 3, 0, 0.0, 1221.3333333333333, 435, 2158, 1071.0, 2158.0, 2158.0, 2158.0, 0.48504446240905413, 0.3740463318512531, 0.37751995755860956], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-18", 3, 0, 0.0, 101.33333333333333, 78, 137, 89.0, 137.0, 137.0, 137.0, 2.074688796680498, 1.3311235736514524, 1.0697614107883817], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-14", 3, 1, 33.333333333333336, 11890.333333333334, 8193, 17847, 9631.0, 17847.0, 17847.0, 17847.0, 0.14040342584359058, 364.27097532117284, 0.0501832557214396], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-15", 3, 1, 33.333333333333336, 6809.666666666666, 2293, 12922, 5214.0, 12922.0, 12922.0, 12922.0, 0.1405349697849815, 153.8286538360191, 0.05023027240361643], "isController": false}, {"data": ["Test", 3, 3, 100.0, 29548.333333333332, 28945, 30283, 29417.0, 30283.0, 30283.0, 30283.0, 0.09695872790148993, 1417.1372468468214, 2.576981190006787], "isController": true}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222", 3, 1, 33.333333333333336, 20950.333333333332, 19589, 22080, 21182.0, 22080.0, 22080.0, 22080.0, 0.12141816415735794, 1357.9560833029789, 1.737323184798446], "isController": false}, {"data": ["https://tracking-api.hotmart.com/rest/track?hotid=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIiwicGFnZXZpZXdfaWQiOiJQVjR6eG5uMW56Y2FrdHh6dzdxOCIsInRyYWNlX2lkIjoiTFRtc3o3Y2huNmQ4a3R4enc4a2QifQ==&cid=1627280424476891769295568189300&bid=1627280424476891769295568189300&sid=cf37ac6af0ff41fdba75628d4ce14620&locationHref=https%3A%2F%2Fgitgithub.andreregino.com.br%2F&account=dde24088-9b16-367b-b10c-d2a86f72dcb4", 3, 0, 0.0, 690.0, 582, 876, 612.0, 876.0, 876.0, 876.0, 2.028397565922921, 0.2555305527383367, 1.9253930020283974], "isController": false}, {"data": ["https://launcher.hotmart.com/rest/v1/module/load-js?hotid=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZjaGVja291dC5ob3RtYXJ0LmNvbSUyRlI1NDYzODc4MUIlM0ZjaGVja291dE1vZGUlM0QxMiUyNl9oaSUzRGV5SmphV1FpT2lJeE5qSTNNamd3TkRJME5EYzJPRGt4TnpZNU1qazFOVFk0TVRnNU16QXdJaXdpWW1sa0lqb2lNVFl5TnpJNE1EUXlORFEzTmpnNU1UYzJPVEk1TlRVMk9ERTRPVE13TUNJc0luTnBaQ0k2SW1ObU16ZGhZelpoWmpCbVpqUXhabVJpWVRjMU5qSTRaRFJqWlRFME5qSXdJaXdpYkc5allYUnBiMjVJY21WbUlqb2lhSFIwY0hNbE0wRWxNa1lsTWtabmFYUm5hWFJvZFdJdVlXNWtjbVZ5WldkcGJtOHVZMjl0TG1KeUpUSkdJbjAlMjUzRC4xNjMyMjkxNzc1NDQyJTI2YmlkJTNEMTYzMjI5MTc3NTY1NyIsInBhZ2V2aWV3X2lkIjoiUFY0enhubjFuemNha3R4enc3cTgiLCJ0cmFjZV9pZCI6IkxUMDl2ZmU4eXl6Y2Qza3R4enc3cTgifQ==&locationHref=https%3A%2F%2Fgitgithub.andreregino.com.br%2F&account=dde24088-9b16-367b-b10c-d2a86f72dcb4", 3, 3, 100.0, 636.0, 584, 721, 603.0, 721.0, 721.0, 721.0, 2.2658610271903323, 0.6085076000755286, 2.874368627265861], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-9", 3, 0, 0.0, 1055.0, 200, 1831, 1134.0, 1831.0, 1831.0, 1831.0, 0.9177118384827164, 1.8891958550015295, 0.4947040379320893], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-6", 3, 0, 0.0, 4901.333333333333, 3300, 5838, 5566.0, 5838.0, 5838.0, 5838.0, 0.513874614594039, 457.31277701053443, 0.26898124357656733], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/", 3, 0, 0.0, 7272.0, 6902, 7896, 7018.0, 7896.0, 7896.0, 7896.0, 0.3799392097264438, 1303.7083402593084, 3.819056919642857], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-5", 3, 0, 0.0, 3952.0, 2769, 4839, 4248.0, 4839.0, 4839.0, 4839.0, 0.6199628022318661, 196.46524333539986, 0.3329878332300062], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-8", 3, 0, 0.0, 3662.3333333333335, 2949, 4501, 3537.0, 4501.0, 4501.0, 4501.0, 0.6036217303822937, 254.76255973340042, 0.3206740442655936], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-7", 3, 0, 0.0, 1788.6666666666667, 802, 3752, 812.0, 3752.0, 3752.0, 3752.0, 0.651890482398957, 159.77428292046935, 0.34122392438070404], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-9", 3, 0, 0.0, 3826.6666666666665, 1755, 6457, 3268.0, 6457.0, 6457.0, 6457.0, 0.19807209824376074, 69.78095495510365, 0.10619295110920375], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-2", 3, 0, 0.0, 1200.3333333333333, 909, 1347, 1345.0, 1347.0, 1347.0, 1347.0, 2.2156573116691285, 18.279172821270308, 1.2160150480059084], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-1", 3, 0, 0.0, 364.66666666666663, 83, 928, 83.0, 928.0, 928.0, 928.0, 3.215434083601286, 4.732089027331189, 1.6391177652733118], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-4", 3, 0, 0.0, 3964.6666666666665, 3462, 4661, 3771.0, 4661.0, 4661.0, 4661.0, 0.6433626420759169, 97.04534868914861, 0.33361871381085134], "isController": false}, {"data": ["https://gitgithub.andreregino.com.br/-3", 3, 0, 0.0, 5780.333333333333, 4455, 6589, 6297.0, 6589.0, 6589.0, 6589.0, 0.4551661356395084, 531.3224532032317, 0.24136251137915338], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: java.net.SocketException: socket closed", 1, 14.285714285714286, 0.8547008547008547], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: java.net.SocketException: Socket closed", 2, 28.571428571428573, 1.7094017094017093], "isController": false}, {"data": ["500/Internal Server Error", 3, 42.857142857142854, 2.5641025641025643], "isController": false}, {"data": ["Assertion failed", 1, 14.285714285714286, 0.8547008547008547], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 117, 7, "500/Internal Server Error", 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: java.net.SocketException: Socket closed", 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: java.net.SocketException: socket closed", 1, "Assertion failed", 1, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-13", 3, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: java.net.SocketException: socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-14", 3, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: java.net.SocketException: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222-15", 3, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: java.net.SocketException: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["https://payment.hotmart.com/R54638781B?checkoutMode=10&_hi=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZnaXRnaXRodWIuYW5kcmVyZWdpbm8uY29tLmJyJTJGIn0=.1632465650222", 3, 1, "Assertion failed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["https://launcher.hotmart.com/rest/v1/module/load-js?hotid=eyJjaWQiOiIxNjI3MjgwNDI0NDc2ODkxNzY5Mjk1NTY4MTg5MzAwIiwiYmlkIjoiMTYyNzI4MDQyNDQ3Njg5MTc2OTI5NTU2ODE4OTMwMCIsInNpZCI6ImNmMzdhYzZhZjBmZjQxZmRiYTc1NjI4ZDRjZTE0NjIwIiwibG9jYXRpb25IcmVmIjoiaHR0cHMlM0ElMkYlMkZjaGVja291dC5ob3RtYXJ0LmNvbSUyRlI1NDYzODc4MUIlM0ZjaGVja291dE1vZGUlM0QxMiUyNl9oaSUzRGV5SmphV1FpT2lJeE5qSTNNamd3TkRJME5EYzJPRGt4TnpZNU1qazFOVFk0TVRnNU16QXdJaXdpWW1sa0lqb2lNVFl5TnpJNE1EUXlORFEzTmpnNU1UYzJPVEk1TlRVMk9ERTRPVE13TUNJc0luTnBaQ0k2SW1ObU16ZGhZelpoWmpCbVpqUXhabVJpWVRjMU5qSTRaRFJqWlRFME5qSXdJaXdpYkc5allYUnBiMjVJY21WbUlqb2lhSFIwY0hNbE0wRWxNa1lsTWtabmFYUm5hWFJvZFdJdVlXNWtjbVZ5WldkcGJtOHVZMjl0TG1KeUpUSkdJbjAlMjUzRC4xNjMyMjkxNzc1NDQyJTI2YmlkJTNEMTYzMjI5MTc3NTY1NyIsInBhZ2V2aWV3X2lkIjoiUFY0enhubjFuemNha3R4enc3cTgiLCJ0cmFjZV9pZCI6IkxUMDl2ZmU4eXl6Y2Qza3R4enc3cTgifQ==&locationHref=https%3A%2F%2Fgitgithub.andreregino.com.br%2F&account=dde24088-9b16-367b-b10c-d2a86f72dcb4", 3, 3, "500/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
