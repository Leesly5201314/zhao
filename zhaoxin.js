/*************************************

应用名称：赵云与阿斗-小游戏
脚本功能：辅助小工具
更新日期：2026-07-07
使用声明：仅供参考，禁止转载与售卖！

**************************************

[rewrite_local]
^https?:\/\/.*\.mihuangame\.com\/.* url script-response-body https://raw.githubusercontent.com/Leesly5201314/zhao/main/zhaoxin.js
^https?:\/\/.*\.mihuangame\.com\/.* url script-request-body https://raw.githubusercontent.com/Leesly5201314/zhao/main/zhaoxin.js

[mitm]
hostname = *.mihuangame.com

*************************************/

// 调试：在ShadowRocket最近请求中可以看到脚本是否执行
var url = $request ? $request.url : "unknown";
var log = "[ZYYAD] triggered url=" + url;

if (typeof $response === "undefined") {
  // 请求阶段
  var reqBody = $request.body;
  var reqObj = null;
  try { reqObj = JSON.parse(reqBody); } catch(e) {}
  
  if (reqObj) {
    var reqModified = false;
    // 修改请求中的体力和金币
    if (reqObj.sm !== undefined) { reqObj.sm = 999999; reqModified = true; }
    if (reqObj.gd !== undefined) { reqObj.gd = 9999999; reqModified = true; }
    if (reqModified) {
      log += " [request modified]";
      $done({ body: JSON.stringify(reqObj) });
      return;
    }
  }
  log += " [request passthrough]";
  $done({});
} else {
  // 响应阶段
  var body = $response.body;
  var obj = null;
  try { obj = JSON.parse(body); } catch(e) {}
  
  if (!obj) {
    log += " [response not json]";
    $done({});
    return;
  }
  
  var modified = false;
  
  // 模式1: login接口返回 {code:0, data:{userData:{gd:xxx, sm:xxx, ...}}}
  if (obj.data && obj.data.userData) {
    var d = obj.data.userData;
    if (d.gd !== undefined) { d.gd = 9999999; modified = true; }
    if (d.sm !== undefined) { d.sm = 999999; modified = true; }
  }
  
  // 模式2: 直接返回 {gd:xxx, sm:xxx}
  if (obj.gd !== undefined) { obj.gd = 9999999; modified = true; }
  if (obj.sm !== undefined) { obj.sm = 999999; modified = true; }
  
  // 模式3: data直接是userData {code:0, data:{gd:xxx, sm:xxx}}
  if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
    if (obj.data.gd !== undefined) { obj.data.gd = 9999999; modified = true; }
    if (obj.data.sm !== undefined) { obj.data.sm = 999999; modified = true; }
  }
  
  if (modified) {
    log += " [response modified]";
    $done({ body: JSON.stringify(obj) });
  } else {
    // 没有匹配到字段，输出response的keys供调试
    var keys = Object.keys(obj).join(",");
    log += " [response keys=" + keys + "]";
    if (obj.data) {
      var dataKeys = typeof obj.data === "object" ? Object.keys(obj.data).join(",") : typeof obj.data;
      log += " [data keys=" + dataKeys + "]";
      if (obj.data.userData) {
        var udKeys = Object.keys(obj.data.userData).join(",");
        log += " [userData keys=" + udKeys + "]";
      }
    }
    $done({});
  }
}
