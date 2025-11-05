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

    var data = {"OkPercent": 85.6886251990148, "KoPercent": 14.311374800985208};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8568862519901479, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.851369059935168, 500, 1500, "05- Delete API"], "isController": false}, {"data": [0.8547348225298068, 500, 1500, "04- Patch API"], "isController": false}, {"data": [0.8501735047968974, 500, 1500, "03- Put API"], "isController": false}, {"data": [0.8665360183808622, 500, 1500, "02- Post API"], "isController": false}, {"data": [0.861400093966038, 500, 1500, "01- Get API"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 73487, 10517, 14.311374800985208, 1.160803951719348, 0, 82, 1.0, 2.0, 2.0, 4.0, 246.56012937470013, 209.86235694466347, 45.618514856198146], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["05- Delete API", 14499, 2155, 14.863094006483205, 1.1525622456721187, 0, 30, 1.0, 2.0, 2.0, 4.0, 50.00810532088448, 45.35498624358904, 10.394373441450266], "isController": false}, {"data": ["04- Patch API", 14594, 2120, 14.526517747019323, 1.155954501850076, 0, 33, 1.0, 2.0, 2.0, 4.0, 50.00599633367027, 45.091579273672664, 10.351545769158285], "isController": false}, {"data": ["03- Put API", 14697, 2202, 14.982649520310268, 1.149758454106281, 0, 32, 1.0, 2.0, 2.0, 4.0, 50.00799610742685, 45.308392292220304, 10.130640126678758], "isController": false}, {"data": ["02- Post API", 14798, 1975, 13.346398161913772, 1.1695499391809625, 0, 31, 1.0, 2.0, 2.0, 4.0, 50.00321009931034, 44.275707219724545, 10.409255191490873], "isController": false}, {"data": ["01- Get API", 14899, 2065, 13.8599906033962, 1.1757836096382286, 0, 82, 1.0, 2.0, 2.0, 4.0, 49.98842472210945, 32.9502532773554, 5.046097705410856], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8080 failed to respond", 10517, 100.0, 14.311374800985208], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 73487, 10517, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8080 failed to respond", 10517, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["05- Delete API", 14499, 2155, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8080 failed to respond", 2155, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["04- Patch API", 14594, 2120, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8080 failed to respond", 2120, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["03- Put API", 14697, 2202, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8080 failed to respond", 2202, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02- Post API", 14798, 1975, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8080 failed to respond", 1975, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["01- Get API", 14899, 2065, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8080 failed to respond", 2065, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
