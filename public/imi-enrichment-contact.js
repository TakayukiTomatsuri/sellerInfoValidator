(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.IMIEnrichmentContact = factory());
}(this, (function () { 'use strict';

  var replacer = function(keyval) {
    var reg = new RegExp("[" + Object.keys(keyval).map(function (a) { return "\\" + a; }).join("") + "]", "g");
    var rep = function (a) { return keyval[a]; };
    return function (src) { return src.replace(reg, rep); };
  };

  var normalize = replacer({
    "〇": "0",
    "一": "1",
    "二": "2",
    "三": "3",
    "四": "4",
    "五": "5",
    "六": "6",
    "七": "7",
    "八": "8",
    "九": "9",
    "０": "0",
    "１": "1",
    "２": "2",
    "３": "3",
    "４": "4",
    "５": "5",
    "６": "6",
    "７": "7",
    "８": "8",
    "９": "9",
    "（": "(",
    "）": ")",
    "[": "(",
    "]": ")",
    "［": "(",
    "］": ")",
    "{": "(",
    "}": ")",
    "｛": "(",
    "｝": ")",
    "【": "(",
    "】": ")",
    "『": "(",
    "』": ")",
    "「": "(",
    "」": ")",
    "〈": "(",
    "〉": ")",
    "《": "(",
    "》": ")",
    "＋": "+",
    "ー": "-",
    "ー": "-",
    "‐": "-",
    "－": "-",
    "~": "-",
    "～": "-",
    "、": ",",
    "，": ","
  });

  var areacode = [
  	"3",
  	"4",
  	"6",
  	"11",
  	"15",
  	"17",
  	"18",
  	"19",
  	"22",
  	"23",
  	"24",
  	"25",
  	"26",
  	"27",
  	"28",
  	"29",
  	"42",
  	"43",
  	"44",
  	"45",
  	"46",
  	"47",
  	"48",
  	"49",
  	"52",
  	"53",
  	"54",
  	"55",
  	"58",
  	"59",
  	"72",
  	"73",
  	"75",
  	"76",
  	"77",
  	"78",
  	"79",
  	"82",
  	"83",
  	"84",
  	"86",
  	"87",
  	"88",
  	"89",
  	"92",
  	"93",
  	"95",
  	"96",
  	"97",
  	"98",
  	"99",
  	"123",
  	"124",
  	"125",
  	"126",
  	"133",
  	"134",
  	"135",
  	"136",
  	"137",
  	"138",
  	"139",
  	"142",
  	"143",
  	"144",
  	"145",
  	"146",
  	"152",
  	"153",
  	"154",
  	"155",
  	"156",
  	"157",
  	"158",
  	"162",
  	"163",
  	"164",
  	"165",
  	"166",
  	"167",
  	"172",
  	"173",
  	"174",
  	"175",
  	"176",
  	"178",
  	"179",
  	"182",
  	"183",
  	"184",
  	"185",
  	"186",
  	"187",
  	"191",
  	"192",
  	"193",
  	"194",
  	"195",
  	"197",
  	"198",
  	"220",
  	"223",
  	"224",
  	"225",
  	"226",
  	"228",
  	"229",
  	"233",
  	"234",
  	"235",
  	"237",
  	"238",
  	"240",
  	"241",
  	"242",
  	"243",
  	"244",
  	"246",
  	"247",
  	"248",
  	"250",
  	"254",
  	"255",
  	"256",
  	"257",
  	"258",
  	"259",
  	"260",
  	"261",
  	"263",
  	"264",
  	"265",
  	"266",
  	"267",
  	"268",
  	"269",
  	"270",
  	"274",
  	"276",
  	"277",
  	"278",
  	"279",
  	"280",
  	"282",
  	"283",
  	"284",
  	"285",
  	"287",
  	"288",
  	"289",
  	"291",
  	"293",
  	"294",
  	"295",
  	"296",
  	"297",
  	"299",
  	"422",
  	"428",
  	"436",
  	"438",
  	"439",
  	"460",
  	"463",
  	"465",
  	"466",
  	"467",
  	"470",
  	"475",
  	"476",
  	"478",
  	"479",
  	"480",
  	"493",
  	"494",
  	"495",
  	"531",
  	"532",
  	"533",
  	"536",
  	"537",
  	"538",
  	"539",
  	"544",
  	"545",
  	"547",
  	"548",
  	"550",
  	"551",
  	"553",
  	"554",
  	"555",
  	"556",
  	"557",
  	"558",
  	"561",
  	"562",
  	"563",
  	"564",
  	"565",
  	"566",
  	"567",
  	"568",
  	"569",
  	"572",
  	"573",
  	"574",
  	"575",
  	"576",
  	"577",
  	"578",
  	"581",
  	"584",
  	"585",
  	"586",
  	"587",
  	"594",
  	"595",
  	"596",
  	"597",
  	"598",
  	"599",
  	"721",
  	"725",
  	"735",
  	"736",
  	"737",
  	"738",
  	"739",
  	"740",
  	"742",
  	"743",
  	"744",
  	"745",
  	"746",
  	"747",
  	"748",
  	"749",
  	"761",
  	"763",
  	"765",
  	"766",
  	"767",
  	"768",
  	"770",
  	"771",
  	"772",
  	"773",
  	"774",
  	"776",
  	"778",
  	"779",
  	"790",
  	"791",
  	"794",
  	"795",
  	"796",
  	"797",
  	"798",
  	"799",
  	"820",
  	"823",
  	"824",
  	"826",
  	"827",
  	"829",
  	"833",
  	"834",
  	"835",
  	"836",
  	"837",
  	"838",
  	"845",
  	"846",
  	"847",
  	"848",
  	"852",
  	"853",
  	"854",
  	"855",
  	"856",
  	"857",
  	"858",
  	"859",
  	"863",
  	"865",
  	"866",
  	"867",
  	"868",
  	"869",
  	"875",
  	"877",
  	"879",
  	"880",
  	"883",
  	"884",
  	"885",
  	"887",
  	"889",
  	"892",
  	"893",
  	"894",
  	"895",
  	"896",
  	"897",
  	"898",
  	"920",
  	"930",
  	"940",
  	"942",
  	"943",
  	"944",
  	"946",
  	"947",
  	"948",
  	"949",
  	"950",
  	"952",
  	"954",
  	"955",
  	"956",
  	"957",
  	"959",
  	"964",
  	"965",
  	"966",
  	"967",
  	"968",
  	"969",
  	"972",
  	"973",
  	"974",
  	"977",
  	"978",
  	"979",
  	"980",
  	"982",
  	"983",
  	"984",
  	"985",
  	"986",
  	"987",
  	"993",
  	"994",
  	"995",
  	"996",
  	"997",
  	"1267",
  	"1372",
  	"1374",
  	"1377",
  	"1392",
  	"1397",
  	"1398",
  	"1456",
  	"1457",
  	"1466",
  	"1547",
  	"1558",
  	"1564",
  	"1586",
  	"1587",
  	"1632",
  	"1634",
  	"1635",
  	"1648",
  	"1654",
  	"1655",
  	"1656",
  	"1658",
  	"4992",
  	"4994",
  	"4996",
  	"4998",
  	"5769",
  	"5979",
  	"7468",
  	"8387",
  	"8388",
  	"8396",
  	"8477",
  	"8512",
  	"8514",
  	"9496",
  	"9802",
  	"9912",
  	"9913",
  	"9969"
  ];

  var areacode$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': areacode
  });

  function getCjsExportFromNamespace (n) {
  	return n && n['default'] || n;
  }

  var require$$0 = getCjsExportFromNamespace(areacode$1);

  var areacode$2 = require$$0.sort(function (a, b) { return b.length - a.length; });

  var format = function(phone) {

    var numbers = phone.replace(/[^0-9]/, "");

    // 00から始まる番号:中継する電話会社を使って電話する時や国際電話をかける時に使います。
    if (numbers.match(/^00/)) {
      throw new Error("00 で始まる番号は特別な番号です");
    }

    // 電気通信番号指定状況で HEAD-CDE-TAIL となっているもの
    if (phone.match(/^(0800|0570|0990|0120|0600|020|070|080|090)([0-9]{3})([0-9]+)$/)) {
      var head = RegExp.$1;
      var body = RegExp.$2;
      var tail = RegExp.$3;
      return (head + "-" + body + "-" + tail);
    }

    // 電気通信番号指定状況で HEAD-CDEF-TAIL となっているもの
    if (phone.match(/^(050)([0-9]{4})([0-9]+)$/)) {
      var head$1 = RegExp.$1;
      var body$1 = RegExp.$2;
      var tail$1 = RegExp.$3;
      return (head$1 + "-" + body$1 + "-" + tail$1);
    }

    /*
      // 0A0から始まる番号(Aは0以外）:携帯電話、PHS、発信者課金ポケットベル、IP電話等に電話する時に使います。
      // 主に携帯電話番号、3-4-* でフォーマットする
      if (phone.match(/^(0[1-9]0)([0-9]{4})([0-9]+)$/)) {
        const head = RegExp.$1;
        const body = RegExp.$2;
        const tail = RegExp.$3;
        return `${head}-${body}-${tail}`;
      }

      // 0AB0から始まる番号（A、Bは0以外）電話会社が提供する高度な電話サービスを利用する時などに使います。
      // 主にフリーダイヤル、4-* でフォーマットする
      if (phone.match(/^(0[1-9][1-9]0)([0-9]+)$/)) {
        const head = RegExp.$1;
        const body = RegExp.$2;
        return `${head}-${body}`;
      }*/

    // 0ABCから始まる番号（A、B、Cは0以外）固定電話に電話する時に使います。（市外通話）(0－市外局番－市内局番－加入者番号）
    // 主に一般電話番号、
    if (phone.match(/^0[1-9]{3}[0-9]+$/)) {
      phone.match(/^0([0-9]{5})([0-9]+)$/);
      var head$2 = RegExp.$1;
      var tail$2 = RegExp.$2;
      var code = areacode$2.find(function (a) { return head$2.indexOf(a) === 0; });
      if (code) {
        var body$2 = head$2.replace(code, "");
        // 市内局番は 2-9 から始まる番号である
        if (!body$2.match(/^[2-9][0-9]*/))
          { throw new Error("市外局番に続く番号は 2-9 で始まる番号でなければなりません"); }
        return ("(0" + code + ")" + body$2 + "-" + tail$2);
      } else {
        throw new Error("該当する市外局番がありません");
      }
    }

    // 1から始まる番号	緊急性、公共性、安全性の観点から重要な時や付加サービスに使います。
    if (phone.match(/^1[0-9]*$/)) {
      throw new Error("1 で始まる番号は特別な番号です");
    }

    // 2～9から始まる番号	固定電話に電話する時に使います。（市内通話）
    if (phone.match(/^[2-9][0-9]*$/)) {
      throw new Error("2-9 で始まる番号は市内通話用の番号です");
    }


    return phone;
  };

  var metadata = function(s, o) {
    if (s["メタデータ"] === undefined) { s["メタデータ"] = o; }
    else if (Array.isArray(s["メタデータ"])) { s["メタデータ"].push(o); }
    else { s["メタデータ"] = [s["メタデータ"], o]; }
  };

  var main = function(json) {
    if (json["@type"] !== '連絡先型' || json["電話番号"] === undefined) { return json; }

    var val = normalize(json["電話番号"]);

    if (val.indexOf("+") === 0) {
      json["電話番号"] = val;
      return json;
    }

    if (val.match(/^([0-9\+\-\(\)\,]+)$/)) {
      var head = RegExp.$1;
      try {
        json["電話番号"] = format(head.replace(/[^0-9]/g, ""));
      } catch (e) {
        json["電話番号"] = head;
        metadata(json, {
          "@type": "文書型",
          "説明": e.message
        });
      }
    } else if (val.match(/^([0-9\+\-\(\)\,]+)\(([^\)]+)\)(.*)$/)) {
      var head$1 = RegExp.$1;
      var body = RegExp.$2;
      if (json["内線番号"] === undefined)
        { json["内線番号"] = json["電話番号"].substring(head$1.length + 1, head$1.length + body.length + 1); }
      try {
        json["電話番号"] = format(head$1.replace(/[^0-9]/g, ""));
      } catch (e) {
        json["電話番号"] = head$1;
        metadata(json, {
          "@type": "文書型",
          "説明": e.message
        });
      }
    } else {
      json["電話番号"] = val;
      metadata(json, {
        "@type": "文書型",
        "説明": "電話番号を正規化できませんでした"
      });
    }

    return json;
  };

  var dig = function(src) {
    if (Array.isArray(src)) { return src.map(dig); }
    if (typeof src !== 'object') { return src; }

    var dst = {};
    Object.keys(src).forEach(function (key) {
      dst[key] = dig(src[key]);
    });
    return main(dst);
  };

  var main_1 = function(src, options) {
    if (typeof src === 'string') {
      return dig({
        "@context": "https://imi.go.jp/ns/core/context.jsonld",
        "@type": "連絡先型",
        "電話番号": src
      });
    }
    return dig(src);
  };

  return main_1;

})));
