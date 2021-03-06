HTMLWidgets.widget({

    name: "bubbleForce",

    type: "output",

    initialize: function(el, width, height) {

        d3.select(el).append("svg")
            .attr("width", width)
            .attr("height", height);

        return d3.layout.force();
    },

    resize: function(el, width, height, force) {

        d3.select(el).select("svg")
            .attr("width", width)
            .attr("height", height);

        force.size([width, height]).resume();
    },

    renderValue: function(el, x, force) {

        // alias options
        var width = 560,
            height = 500,
            padding = 1.5, // separation between same-color nodes
            clusterPadding = 6, // separation between different-color nodes
            maxRadius = 12;

        var n = x.n, // total number of nodes
            m = x.m; // number of distinct clusters

        var color = d3.scale.category10()
            .domain(d3.range(m));

        // convert links and nodes data frames to d3 friendly format
        //var clusters = [{"cluster":0,"radius":8.652472483989106,"x":680.342284598155,"y":250.12776728277095},{"cluster":1,"radius":8.879179278774714,"x":641.8743222897693,"y":368.3138823170346},{"cluster":2,"radius":15.872464566805316,"x":542.6957837661549,"y":440.81918446558416},{"cluster":3,"radius":11.937497898017334,"x":418.20262550988167,"y":440.63017268736735},{"cluster":4,"radius":11.567291896921194,"x":318.46520193346703,"y":368.46631188678003},{"cluster":5,"radius":18.10990690694368,"x":280.1356113804504,"y":250.9617868952919},{"cluster":6,"radius":21.655097399465564,"x":318.33416021784694,"y":132.6160160066895},{"cluster":7,"radius":25.58397404678231,"x":418.7624233500745,"y":60.364797494123906},{"cluster":8,"radius":11.780550576498172,"x":542.1358541228628,"y":59.83455643195771},{"cluster":9,"radius":22.01040328442042,"x":642.4744278599328,"y":132.9522233809213}];
        var clusters = HTMLWidgets.dataframeToD3(x.clusters);
        //var nodes = [{"cluster":3,"radius":13.112535167220194,"x":418.4648776786116,"y":441.0390176088724},{"cluster":7,"radius":5.109421629313969,"x":418.3839366387755,"y":60.606761826883286},{"cluster":5,"radius":6.399684516410465,"x":280.5123371533118,"y":250.4649517014623},{"cluster":1,"radius":5.353685417110638,"x":642.5425979722578,"y":368.37664308782115},{"cluster":2,"radius":9.667569241896562,"x":542.7656292039256,"y":441.0557837912522},{"cluster":0,"radius":3.9384915875176345,"x":680.0402610462625,"y":250.84961532638408},{"cluster":4,"radius":1.571984771464654,"x":318.76885394246244,"y":368.4969821473249},{"cluster":0,"radius":2.8000264276137066,"x":680.1912934342399,"y":250.0133677246049},{"cluster":0,"radius":3.2017409371021435,"x":680.4692866180558,"y":250.32656607264653},{"cluster":8,"radius":19.854971638346925,"x":541.8850022851775,"y":59.846919028536604},{"cluster":5,"radius":12.293038053510433,"x":280.20919276657514,"y":250.61264462443071},{"cluster":9,"radius":24.228683858463427,"x":642.7223479043978,"y":133.03159999371124},{"cluster":4,"radius":7.445551802003653,"x":318.7010635899559,"y":368.01829506444193},{"cluster":3,"radius":6.613311649345535,"x":419.09800948325477,"y":440.54067466852143},{"cluster":6,"radius":12.752909334239735,"x":318.7326993926607,"y":133.1470062643159},{"cluster":2,"radius":3.141408731906364,"x":542.7264889135778,"y":440.570647446689},{"cluster":9,"radius":13.755586482500696,"x":642.4098821826565,"y":133.2761081772725},{"cluster":7,"radius":4.931984469659047,"x":418.3377779515639,"y":60.38438170587759},{"cluster":0,"radius":2.445757389387995,"x":680.970882355934,"y":250.9852028361056},{"cluster":4,"radius":10.048264745191311,"x":319.0026540209718,"y":367.62567051138177},{"cluster":4,"radius":10.39983124590512,"x":318.52875106089675,"y":368.06755438946567},{"cluster":3,"radius":12.684235707876542,"x":419.0639862479356,"y":440.9201516399801},{"cluster":7,"radius":16.23363287204945,"x":418.4745992746383,"y":59.879318685020536},{"cluster":7,"radius":18.02497885887232,"x":418.7211957502358,"y":60.01691493227261},{"cluster":7,"radius":11.285297578542357,"x":418.7766304740861,"y":60.58790621858205},{"cluster":6,"radius":14.947016158824683,"x":318.5242359466564,"y":132.48787076946905},{"cluster":7,"radius":11.206298258423418,"x":418.48457947379836,"y":59.86971273131783},{"cluster":6,"radius":13.511607088221218,"x":318.4231442227673,"y":132.85957208474724},{"cluster":5,"radius":4.732379180768487,"x":280.04184341803193,"y":250.58028729190121},{"cluster":3,"radius":1.2352164109864177,"x":418.7569385076121,"y":440.28775278899707},{"cluster":4,"radius":8.895406976516556,"x":318.76233593893164,"y":367.57319201516367},{"cluster":9,"radius":10.006870503999414,"x":642.7070683354332,"y":132.4979870586059},{"cluster":3,"radius":4.553119871283067,"x":418.2364502051559,"y":440.73105151813365},{"cluster":0,"radius":1.907476471999248,"x":680.2310793839861,"y":250.56989199179225},{"cluster":0,"radius":3.0394117753751795,"x":680.3522501494735,"y":250.19694326189347},{"cluster":7,"radius":6.016525965060481,"x":418.5518042755492,"y":60.139112553774595},{"cluster":8,"radius":2.872381632444971,"x":542.746360588987,"y":60.388233951275424},{"cluster":8,"radius":1.5966075120576124,"x":542.7116445900692,"y":60.511025942378865},{"cluster":6,"radius":3.840057623413583,"x":318.6269897067167,"y":133.32646446128933},{"cluster":8,"radius":8.406972561591243,"x":541.8765936295322,"y":60.40435167609826},{"cluster":1,"radius":3.916458268609747,"x":642.6492355816819,"y":367.946825842945},{"cluster":7,"radius":16.326819436800665,"x":418.89166257839577,"y":60.62329961683716},{"cluster":9,"radius":9.22233727188151,"x":642.1455657018168,"y":132.79580304993866},{"cluster":8,"radius":4.949697504719074,"x":542.2601767426177,"y":60.612892232584954},{"cluster":2,"radius":8.722515638011284,"x":542.2253147931125,"y":440.21506384389363},{"cluster":7,"radius":6.855578650920831,"x":418.24415036856124,"y":60.233010777720466},{"cluster":8,"radius":7.073883590865945,"x":542.8000601869362,"y":60.72529056852795},{"cluster":8,"radius":16.78960421360285,"x":542.0121300997498,"y":60.13127113178484},{"cluster":4,"radius":11.857361454549906,"x":318.3378990970731,"y":368.16993966150477},{"cluster":3,"radius":4.265035155032514,"x":418.5338251810235,"y":440.47479003250487},{"cluster":5,"radius":4.68332362027954,"x":280.58909451123327,"y":250.34044655528854},{"cluster":2,"radius":5.439826759386443,"x":542.6099695937529,"y":440.7048686016526},{"cluster":1,"radius":10.597133485971387,"x":641.9161224352948,"y":367.84427416544787},{"cluster":5,"radius":7.469391511040165,"x":280.5826266182121,"y":250.89719910267743},{"cluster":4,"radius":10.658392721920983,"x":319.08339869959207,"y":368.52847905560776},{"cluster":9,"radius":12.285946480007397,"x":642.5794645335345,"y":132.93746665691575},{"cluster":1,"radius":2.2303203475883446,"x":642.7450575448394,"y":367.7450547256638},{"cluster":9,"radius":2.105537168799785,"x":642.4128716226487,"y":133.3916666604447},{"cluster":5,"radius":7.372785450634035,"x":280.7644316069782,"y":250.6312318767887},{"cluster":2,"radius":6.278579466306951,"x":541.9869568910736,"y":440.6917293484032},{"cluster":0,"radius":5.319544639136849,"x":680.6861454262398,"y":250.17822758085094},{"cluster":5,"radius":22.5322144083228,"x":280.49568414967507,"y":250.1429544396233},{"cluster":4,"radius":12.184907388725737,"x":318.40450190409945,"y":367.77197859214067},{"cluster":0,"radius":3.1249446977364643,"x":680.2004468759988,"y":250.0629779114388},{"cluster":4,"radius":12.77251841235893,"x":318.8362684292432,"y":367.72203519159376},{"cluster":7,"radius":8.085296821574058,"x":418.60624254827314,"y":60.70792843981761},{"cluster":6,"radius":10.1694552815525,"x":319.1242634924773,"y":133.21675748413986},{"cluster":9,"radius":13.12463210625571,"x":641.9335938903323,"y":132.8155631764195},{"cluster":0,"radius":1.885091814686083,"x":680.0634421242867,"y":250.8720285347663},{"cluster":6,"radius":5.686142386574278,"x":318.68157234538273,"y":132.65334495961292},{"cluster":4,"radius":4.615095995753941,"x":319.04427285172903,"y":368.2790097879377},{"cluster":0,"radius":4.4293445362375765,"x":680.1900794992689,"y":250.19003518205136},{"cluster":3,"radius":9.46657293505738,"x":418.59553852218136,"y":440.9011929212313},{"cluster":6,"radius":5.3685987700396645,"x":318.5361797030263,"y":133.08037468081898},{"cluster":7,"radius":10.096971426572527,"x":418.7500107752338,"y":59.80812552336718},{"cluster":3,"radius":12.949026531503833,"x":418.3632814193324,"y":440.3179815944925},{"cluster":3,"radius":3.0114373797407747,"x":418.76944563521005,"y":440.57484857483655},{"cluster":7,"radius":0.69412867307504,"x":419.0336827804048,"y":60.374365620297596},{"cluster":7,"radius":3.1158390825567297,"x":419.1085191965748,"y":59.79709102234918},{"cluster":5,"radius":2.2358593335989547,"x":280.3530043878127,"y":250.792430984322},{"cluster":4,"radius":5.004830427066488,"x":318.4038349318497,"y":368.1012743128129},{"cluster":3,"radius":2.9800150011456537,"x":419.10507499735735,"y":441.0264272673696},{"cluster":6,"radius":3.4375550780178195,"x":318.7900983088829,"y":133.3231564696282},{"cluster":2,"radius":3.738845125312082,"x":542.3149888521813,"y":440.2233801994182},{"cluster":7,"radius":11.613121745020063,"x":419.13702171977536,"y":60.54616854244958},{"cluster":2,"radius":5.546515154166772,"x":542.1367443142746,"y":440.52969093832075},{"cluster":3,"radius":14.6678189599683,"x":418.5842805710335,"y":440.8141302277975},{"cluster":8,"radius":5.228090355570616,"x":542.5387776190701,"y":60.67529113053456},{"cluster":2,"radius":1.3219143344102031,"x":541.84999747824,"y":440.40456163396016},{"cluster":3,"radius":7.138428399766954,"x":418.8322890448098,"y":440.6560583091516},{"cluster":9,"radius":3.9948549533780597,"x":642.3756145659654,"y":132.5379562528207},{"cluster":0,"radius":2.1526625591880117,"x":680.841872891644,"y":250.8975260592997},{"cluster":5,"radius":6.66585025594825,"x":280.8463532847818,"y":250.74671066273007},{"cluster":3,"radius":5.693657978420542,"x":419.08520709427006,"y":440.7463373004168},{"cluster":6,"radius":15.143410821161808,"x":318.5526297772948,"y":132.4769746124614},{"cluster":3,"radius":3.55219492604743,"x":418.2176144337927,"y":440.26699256759025},{"cluster":9,"radius":16.23633442890244,"x":642.1453180156468,"y":133.28564149968875},{"cluster":6,"radius":7.645419380883134,"x":318.30563801417054,"y":133.3005900270175},{"cluster":1,"radius":5.0268620170938085,"x":642.5933176632326,"y":367.874828768069},{"cluster":5,"radius":12.961116934367839,"x":280.90199734293856,"y":250.96951084933247},{"cluster":2,"radius":3.269699674882224,"x":542.0173350772176,"y":440.5519587083429},{"cluster":0,"radius":3.67178763731245,"x":680.3861581194215,"y":250.46763917966746},{"cluster":5,"radius":8.00099794337104,"x":280.508698126534,"y":250.94724159874025},{"cluster":7,"radius":7.903800525999963,"x":418.43244722911083,"y":60.141048080037564},{"cluster":7,"radius":14.027418013917437,"x":418.6850294825334,"y":60.025532993470534},{"cluster":2,"radius":5.037449253921186,"x":542.1347208951421,"y":440.9571848823864},{"cluster":3,"radius":6.925224482267483,"x":418.6371262286038,"y":440.9289131683938},{"cluster":5,"radius":7.993439517662441,"x":280.32898984709755,"y":250.63156764046292},{"cluster":1,"radius":1.0049434924039886,"x":642.3550452142309,"y":367.8151216042359},{"cluster":9,"radius":12.133450644981103,"x":642.1886091688002,"y":132.8445125141981},{"cluster":0,"radius":3.513040917256838,"x":680.0913931198884,"y":250.78628827654757},{"cluster":7,"radius":2.4764444735710454,"x":418.5591194804937,"y":60.254686140437826},{"cluster":8,"radius":10.008943781917912,"x":542.1250584001473,"y":60.36028159966804},{"cluster":6,"radius":6.834531614868232,"x":318.6839117936969,"y":132.71955188655852},{"cluster":1,"radius":5.128820817579176,"x":641.9216315533787,"y":368.26593986979134},{"cluster":0,"radius":1.8328280754693473,"x":680.2696877850685,"y":250.61747372196987},{"cluster":9,"radius":4.1296811875037225,"x":642.2067787248461,"y":133.37792207033922},{"cluster":5,"radius":15.400805974430046,"x":280.1190271526575,"y":250.9222197257914},{"cluster":4,"radius":6.417868270679037,"x":318.4958637369044,"y":368.28665516419716},{"cluster":7,"radius":6.499783469131401,"x":419.07031617273503,"y":59.844487299426675},{"cluster":0,"radius":4.974134694720668,"x":680.2810098940972,"y":250.58500051684678},{"cluster":4,"radius":5.9899953590668575,"x":319.06901974959226,"y":368.2044677267448},{"cluster":1,"radius":2.998405433832767,"x":642.227755156514,"y":367.7334402332679},{"cluster":1,"radius":6.721750376658558,"x":642.1864716419306,"y":368.400696345944},{"cluster":9,"radius":15.926296027477653,"x":642.3318895203347,"y":133.13171625126702},{"cluster":6,"radius":7.909883548205819,"x":318.6985658289112,"y":132.80568844674713},{"cluster":1,"radius":5.645287088085665,"x":642.1702355483368,"y":367.71098316261924},{"cluster":4,"radius":7.3689274847716195,"x":318.3260378586773,"y":368.22009822527326},{"cluster":6,"radius":10.354942426590842,"x":318.49852484890187,"y":132.9824320195578},{"cluster":8,"radius":9.966504477801232,"x":541.8571350236243,"y":60.59986321183965},{"cluster":1,"radius":2.62046988828486,"x":641.9155201711047,"y":368.0508165395484},{"cluster":5,"radius":5.2739958910663916,"x":280.0478266857099,"y":250.4128274896648},{"cluster":2,"radius":3.031299685597263,"x":542.2480338173274,"y":441.03785752343833},{"cluster":8,"radius":5.982267497038496,"x":542.3613619999314,"y":59.88787512898557},{"cluster":1,"radius":8.491265214509042,"x":642.4613517163608,"y":368.3049150822815},{"cluster":1,"radius":1.6674837659838984,"x":642.3492123979896,"y":367.7049765082673},{"cluster":1,"radius":1.0743142635810603,"x":642.4139816848848,"y":367.58676867477044},{"cluster":8,"radius":10.09042547884902,"x":542.5679314915842,"y":60.324500522325934},{"cluster":6,"radius":17.177773955740342,"x":318.47740477236846,"y":133.14169632469861},{"cluster":4,"radius":3.9086620868272455,"x":319.12083187705764,"y":368.55366477357603},{"cluster":1,"radius":2.117058788348487,"x":642.3822065528303,"y":368.4913641024512},{"cluster":7,"radius":7.696708571471292,"x":418.38195434102715,"y":60.78685772696625},{"cluster":7,"radius":13.822958649340084,"x":418.3032696366489,"y":59.901702956977516},{"cluster":2,"radius":7.15756079485079,"x":542.4223189118139,"y":440.27406475741304},{"cluster":7,"radius":17.00217904647819,"x":418.4882934305996,"y":59.92789242996949},{"cluster":6,"radius":9.705117250652645,"x":318.6962453013465,"y":132.94823776500857},{"cluster":3,"radius":8.006628745975163,"x":418.63395077182844,"y":440.67554298464097},{"cluster":2,"radius":6.367070683738252,"x":541.8451588718973,"y":441.03623873905167},{"cluster":3,"radius":3.1520318247639,"x":418.7585442295012,"y":441.13853963140286},{"cluster":1,"radius":2.592782181161132,"x":642.1559631474603,"y":368.3292999301237},{"cluster":7,"radius":4.255359639996461,"x":418.7130867588047,"y":60.1490342654113},{"cluster":0,"radius":1.282568983571546,"x":680.5560825616121,"y":250.29659985168837},{"cluster":5,"radius":13.953460180679892,"x":280.7833365993574,"y":250.38215713016692},{"cluster":4,"radius":2.0870211957780653,"x":318.68650846096614,"y":367.68924036655955},{"cluster":4,"radius":10.920731225197319,"x":318.6495300594896,"y":367.8767942337916},{"cluster":9,"radius":9.80807701716137,"x":641.9487468415691,"y":133.0635977016165},{"cluster":1,"radius":0.7125590644314268,"x":642.5498787857879,"y":367.77557072822384},{"cluster":8,"radius":13.085663231563025,"x":542.4443391614413,"y":59.833163203421236},{"cluster":8,"radius":8.394375345950987,"x":541.9285884571082,"y":59.99982998797782},{"cluster":5,"radius":8.549295737337232,"x":280.50973121635616,"y":250.36692920653152},{"cluster":8,"radius":8.263387992693154,"x":542.6506468725211,"y":60.765197830722855},{"cluster":2,"radius":6.581562857624652,"x":542.7685732212204,"y":440.2224843397446},{"cluster":6,"radius":15.359903692875609,"x":319.0821848533295,"y":133.3747934358064},{"cluster":3,"radius":13.568389812372281,"x":418.8652145653677,"y":440.2539875845134},{"cluster":6,"radius":1.4321784913691942,"x":318.9563855066143,"y":132.56184636115654},{"cluster":9,"radius":0.9471094046368066,"x":642.0822761626268,"y":132.73577473697802},{"cluster":5,"radius":3.3717434589552404,"x":280.9397696889937,"y":250.08335696277211},{"cluster":9,"radius":10.254592222847506,"x":642.5740811880032,"y":132.8576240431386},{"cluster":7,"radius":7.145903056380374,"x":418.5353798028726,"y":60.09000974845256},{"cluster":5,"radius":7.358971054412516,"x":280.60735160531476,"y":250.58782523591074},{"cluster":4,"radius":7.543337862575298,"x":318.62116642861554,"y":368.5085377065596},{"cluster":2,"radius":0.37799481143106267,"x":542.1714662545647,"y":440.5577527410526},{"cluster":3,"radius":10.74018738983036,"x":418.9643924672336,"y":440.25854109974466},{"cluster":6,"radius":8.710530978872196,"x":319.0430975366097,"y":132.63080321008897},{"cluster":1,"radius":4.716853892332194,"x":642.789415219967,"y":368.4027616834399},{"cluster":2,"radius":1.0019810534766413,"x":542.5609005814705,"y":441.06203612756804},{"cluster":7,"radius":7.037294996766205,"x":418.24699311081247,"y":60.40061640760976},{"cluster":7,"radius":0.5432228877426432,"x":419.1736431541566,"y":60.013574541761756},{"cluster":6,"radius":16.235785269535214,"x":318.2821454448339,"y":132.76319058764352},{"cluster":8,"radius":10.99041820674714,"x":542.4136740359763,"y":59.88500420491323},{"cluster":4,"radius":7.798916414563655,"x":319.0288604754668,"y":368.0503200903666},{"cluster":6,"radius":7.395686325443695,"x":318.81158982293607,"y":132.6016639353577},{"cluster":6,"radius":18.275258256185857,"x":318.5271147911616,"y":132.46480538033506},{"cluster":0,"radius":2.8710507712945685,"x":680.603203356266,"y":250.76448760717176},{"cluster":7,"radius":7.760514100563604,"x":418.48387544026525,"y":60.285001259978145},{"cluster":2,"radius":9.424215674750943,"x":541.9880334601559,"y":441.1497093057435},{"cluster":4,"radius":5.005569190024609,"x":318.3001056693673,"y":367.86292593541003},{"cluster":7,"radius":10.035869374119926,"x":418.51720316039325,"y":60.08993371923569},{"cluster":1,"radius":3.8865898728352515,"x":642.7683569196898,"y":367.7784947793596},{"cluster":7,"radius":10.293318790683138,"x":418.5320062724121,"y":60.222430960956245},{"cluster":2,"radius":7.233085962035134,"x":542.6898302744895,"y":440.60510418821946},{"cluster":4,"radius":7.294801709580865,"x":318.3460521244623,"y":368.1742118255832},{"cluster":3,"radius":5.254472553733428,"x":418.23238114320606,"y":440.2534820207104},{"cluster":4,"radius":5.495118604610564,"x":318.96154943184854,"y":367.5764557135888},{"cluster":8,"radius":7.272187246653192,"x":542.774772040947,"y":60.57896031111591},{"cluster":5,"radius":6.987138494734555,"x":280.1132306647487,"y":250.51683337916623},{"cluster":4,"radius":5.609004479085082,"x":318.639339774213,"y":368.2245523751379},{"cluster":0,"radius":7.85039088981628,"x":680.5493812658824,"y":250.2790705950465},{"cluster":7,"radius":9.203129056006496,"x":418.7204606822405,"y":59.92684862481545},{"cluster":7,"radius":8.843972167702068,"x":419.1624218333226,"y":60.66844439993727}];
        var nodes = HTMLWidgets.dataframeToD3(x.data);

        // get the width and height
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        var force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .gravity(.02)
            .charge(0)
            .on("tick", tick)
            .start();

        // select the svg element and remove existing children
        var svg = d3.select(el).select("svg");
        svg.selectAll("*").remove();

        // draw nodes
        var node = svg.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .style("fill", function(d) {
                return color(d.cluster);
            })
            .call(force.drag);

        // intro transition
        node.transition()
            .duration(750)
            .delay(function(d, i) {
                return i * 5;
            })
            .attrTween("r", function(d) {
                var i = d3.interpolate(0, d.radius);
                return function(t) {
                    return d.radius = i(t);
                };
            });

        function tick(e) {
            node
                .each(cluster(10 * e.alpha * e.alpha))
                .each(collide(.5))
                .attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });
        }

        // Move d to be adjacent to the cluster node.
        function cluster(alpha) {
            return function(d) {
                var cluster = clusters[d.cluster];
                if (cluster === d) return;
                var x = d.x - cluster.x,
                    y = d.y - cluster.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + cluster.radius;
                if (l != r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    cluster.x += x;
                    cluster.y += y;
                }
            };
        }

        // Resolves collisions between d and all other circles.
        function collide(alpha) {
            var quadtree = d3.geom.quadtree(nodes);
            return function(d) {
                var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                    nx1 = d.x - r,
                    nx2 = d.x + r,
                    ny1 = d.y - r,
                    ny2 = d.y + r;
                quadtree.visit(function(quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== d)) {
                        var x = d.x - quad.point.x,
                            y = d.y - quad.point.y,
                            l = Math.sqrt(x * x + y * y),
                            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                        if (l < r) {
                            l = (l - r) / l * alpha;
                            d.x -= x *= l;
                            d.y -= y *= l;
                            quad.point.x += x;
                            quad.point.y += y;
                        }
                    }
                    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                });
            };
        }

        // Legend
        // http://jsfiddle.net/Rom2BE/H2PkT/
        var legendData = {clusterName: x.clusters.clusterName}
        legendData = HTMLWidgets.dataframeToD3(legendData)

        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            // .style("fill", color);
            .style("fill", function(d,i) {
                return color(i);
            });

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) {
                return d.clusterName;
            });

        // Tooltip
        $('svg circle').tipsy({
            gravity: 'w',
            html: true,
            title: function() {
                var d = this.__data__;
                var c = d.cluster;
                var id = d.radius
                return "This is my Cluster: " + c + ' :)! ';
            }
        });

    },
});
