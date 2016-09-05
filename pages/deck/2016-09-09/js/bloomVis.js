var width = 750, 
    height = 600;

var bloom = new BloomFilter(50, 3),
        keys = [],
        keySet = {},
        colour = d3.scale.category20c();

    var bw = height / bloom.m,
        dy = 20;

    var queryText = "";

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; })
        .source(function(d) { return {y: 100, x: d.from * dy}; })
        .target(function(d) { return {y: (width - bw) / 2, x: (d.to + .5) * bw}; });

    d3.select("#bloomVis").selectAll("*").remove();
    var svg = d3.select("#bloomVis").append("svg")
        .attr("width", width - 100)
        .attr("height", height + 20);

    svg.append("defs")
      .append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 10)
        .attr("orient", "auto")
      .append("path")
        .style("fill", "#000")
        .attr("d", "M0,-5L10,0L0,5Z");

    var bloomVis= svg.append("g")
        .attr("transform", "translate(10,10)");

    var div = d3.select("#bloomVis")
        .style("position", "relative")
      .append("div")
        .style("position", "absolute")
        .style("left", width - 100 + "px")
        .style("top", "50%")
        .style("margin-top", "-1.5em");
    div.append("input")
        .attr("type", "text")
        .on("keyup", function() {
          queryText = this.value;
          update();
        });
    var result = div.append("span");

    update();

    var keyInput = d3.select("#key")
        .on("keyup", function() {
          if (d3.event.keyCode === 13) add();
        });
    d3.select("#add").on("click", add);

    function add() {
      var key = keyInput.property("value");
      if (!(key in keySet)) {
        keySet[key] = 1;
        bloom.add(key);
        keys.push({key: key, value: locations(bloom, key)});
        update();
      }
      keyInput.property("value", "");
    }

    function update() {
      var offLocations = locations(bloom, queryText);

      var rect = bloomVis.selectAll("rect")
          .data(buckets(bloom, offLocations));
      rect.enter().append("rect")
          .attr("width", bw)
          .attr("height", bw)
          .attr("x", (width - bw) / 2)
          .attr("y", function(d, i) { return i * bw; });
      rect.exit().remove();
      rect.attr("class", function(d) { return d === 1 ? "on" : d === -1 ? "off" : null; });

      var key = bloomVis.selectAll("text.key")
          .data(keys);
      key.enter().append("text")
          .attr("class", "key")
          .attr("x", 100)
          .attr("text-anchor", "end")
          .attr("dx", "-.3em")
          .attr("dy", ".2em")
          .text(function(d) { return d.key; });
      key.exit().remove();
      key.attr("y", function(d, i) { return height / 2 + (i - keys.length / 2) * dy; });

      var link = bloomVis.selectAll("path.location")
          .data(links(bloom, keys));
      link.enter().append("path")
          .attr("class", "location")
          .attr("marker-end", "url(#arrow)")
          .attr("transform", "translate(0," + height / 2 + ")");
      link.exit().remove();
      link.attr("d", diagonal);

      var link = bloomVis.selectAll("path.query")
          .data(links(bloom, [{key: queryText, value: offLocations}]));
      link.enter().append("path")
          .attr("class", "query")
          .attr("marker-end", "url(#arrow)")
          .attr("transform", "translate(" + width + "," + height / 2 + ")scale(-1,1)");
      link.exit().remove();
      link.attr("d", diagonal);
      result.text(bloom.test(queryText) ? " Probably there." : " Definitely not there.");
    }

    function links(bloom, list) {
      var a = [];
      list.forEach(function(d, i) {
        var b = {};
        d.value.forEach(function(target) {
          b[target] = 1;
        });
        for (var target in b) {
          a.push({from: +i - list.length / 2, to: +target - bloom.m / 2});
        }
      });
      return a;
    }

    function buckets(bloom, off) {
      var d = bloom.buckets,
          a = [],
          m = bloom.m,
          k,
          x,
          n;
      for (var i = 0, j = 0; i < m; i += 32, j++) {
        var x = d[j];
        for (var k = 0, n = Math.min(m - i, 32); k < n; ++k) {
          a.push((x >> k) & 1);
        }
      }
      off.forEach(function(i) {
        if (a[i] === 0) a[i] = -1;
      });
      return a;
    }

    function locations(bloom, key) {
      var l = bloom.locations(key),
          k = bloom.k,
          i = -1,
          a = [];
      for (var i = 0; i < k; ++i) a[i] = l[i];
      return a;
    }

