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

    var data = {"OkPercent": 44.135802469135804, "KoPercent": 55.864197530864196};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.40933641975308643, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "http request (yahoo)-0"], "isController": false}, {"data": [0.7258064516129032, 500, 1500, "http request (yahoo)-1"], "isController": false}, {"data": [0.7444444444444445, 500, 1500, "http request (yahoo)-2"], "isController": false}, {"data": [0.746268656716418, 500, 1500, "http request (yahoo)-3"], "isController": false}, {"data": [0.78, 500, 1500, "http request (yahoo)-4"], "isController": false}, {"data": [0.0, 500, 1500, "http request (yahoo)-5"], "isController": false}, {"data": [0.0, 500, 1500, "http request (google)"], "isController": false}, {"data": [0.0, 500, 1500, "http request (yahoo)"], "isController": false}, {"data": [0.0, 500, 1500, "http request (google)-2"], "isController": false}, {"data": [0.0075, 500, 1500, "http request (google)-1"], "isController": false}, {"data": [0.795, 500, 1500, "http request (google)-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1296, 724, 55.864197530864196, 524.2816358024687, 115, 2561, 406.0, 794.3, 1596.2999999999997, 2444.0, 60.94808126410835, 127.24273199421557, 17.70671675131678], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http request (yahoo)-0", 124, 0, 0.0, 405.7096774193548, 385, 499, 400.5, 420.0, 445.5, 499.0, 6.2813433969910335, 3.907437249886024, 0.8465091687351198], "isController": false}, {"data": ["http request (yahoo)-1", 124, 34, 27.419354838709676, 404.2903225806451, 388, 444, 402.0, 418.5, 426.75, 441.25, 6.296333908804712, 3.422778669899462, 1.4265131512135676], "isController": false}, {"data": ["http request (yahoo)-2", 90, 23, 25.555555555555557, 403.3222222222223, 384, 442, 400.0, 419.9, 431.9, 442.0, 4.681160927910121, 2.569711507203787, 1.060575522729637], "isController": false}, {"data": ["http request (yahoo)-3", 67, 17, 25.37313432835821, 402.3880597014926, 389, 425, 401.0, 411.2, 419.2, 425.0, 3.6694232980995674, 2.0162360000547674, 0.8313537159756832], "isController": false}, {"data": ["http request (yahoo)-4", 50, 11, 22.0, 401.78000000000014, 393, 423, 400.5, 411.8, 416.15, 423.0, 3.9360780917893408, 2.2007442877666694, 0.8917676926710226], "isController": false}, {"data": ["http request (yahoo)-5", 39, 39, 100.0, 401.53846153846155, 389, 440, 398.0, 413.0, 421.0, 440.0, 3.1964593066142117, 1.0738105483157119, 0.7241978116547824], "isController": false}, {"data": ["http request (google)", 200, 200, 100.0, 624.5050000000001, 469, 1131, 608.0, 730.8, 773.0, 1111.99, 9.771350400625366, 51.886967995773894, 4.035453207445769], "isController": false}, {"data": ["http request (yahoo)", 200, 200, 100.0, 1151.585, 388, 2561, 805.0, 2416.8, 2447.0, 2550.8500000000004, 9.899029895070283, 15.334699347901406, 5.483134527816274], "isController": false}, {"data": ["http request (google)-2", 2, 2, 100.0, 129.0, 128, 130, 129.0, 130.0, 130.0, 130.0, 0.6898930665746809, 2.4058673249396345, 0.19807476716109004], "isController": false}, {"data": ["http request (google)-1", 200, 198, 99.0, 139.13000000000005, 115, 583, 131.0, 151.9, 180.0, 373.08000000000084, 10.155377272265666, 35.14191941390779, 2.8558031634000205], "isController": false}, {"data": ["http request (google)-0", 200, 0, 0.0, 483.59500000000014, 140, 949, 470.0, 600.8, 622.95, 916.9200000000001, 9.907366126715212, 17.980031239163818, 1.2771214147718828], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/INKApi Error", 324, 44.751381215469614, 25.0], "isController": false}, {"data": ["429/Too Many Requests", 400, 55.248618784530386, 30.864197530864196], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1296, 724, "429/Too Many Requests", 400, "500/INKApi Error", 324, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["http request (yahoo)-1", 124, 34, "500/INKApi Error", 34, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http request (yahoo)-2", 90, 23, "500/INKApi Error", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http request (yahoo)-3", 67, 17, "500/INKApi Error", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http request (yahoo)-4", 50, 11, "500/INKApi Error", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http request (yahoo)-5", 39, 39, "500/INKApi Error", 39, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http request (google)", 200, 200, "429/Too Many Requests", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http request (yahoo)", 200, 200, "500/INKApi Error", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http request (google)-2", 2, 2, "429/Too Many Requests", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http request (google)-1", 200, 198, "429/Too Many Requests", 198, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
