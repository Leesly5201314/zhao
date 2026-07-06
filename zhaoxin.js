/*************************************

应用名称：赵云与阿斗-小游戏
脚本功能：辅助小工具
更新日期：2026-07-07
使用声明：仅供参考，禁止转载与售卖！

**************************************

[rewrite_local]
^https?:\/\/.*\.mihuangame\.com\/api\/v\d\/sys url script-request-body https://raw.githubusercontent.com/Leesly5201314/zhao/main/zhaoxin.js
^https?:\/\/.*\.mihuangame\.com\/(api\/v\d\/sys\/user|toutiaoGame\/ZhaoYunAndADou) url script-response-body https://raw.githubusercontent.com/Leesly5201314/zhao/main/zhaoxin.js

[mitm]
hostname = *.mihuangame.com

*************************************/

const Gold = 9999999;
const Stamina = 999999;

function safeJson(body) {
  try { return JSON.parse(body || "{}"); } catch (e) { return {}; }
}

let obj = {};
let ddm = {};

if (typeof $response === "undefined") {
  if (/user\/data/.test($request.url)) {
    ddm = safeJson($request.body);
    if (ddm.sm !== undefined) ddm.sm = Stamina;
    if (ddm.gd !== undefined && ddm.gd < Gold) ddm.gd = Gold;
    obj.body = JSON.stringify(ddm);
  }
} else {
  ddm = safeJson($response.body);
  if (/user\/login/.test($request.url)) {
    ddm.data = ddm.data || {};
    ddm.data.userData = ddm.data.userData || {};
    let d = ddm.data.userData;
    if (d.sm !== undefined) d.sm = Stamina;
    if (d.gd !== undefined && d.gd < Gold) d.gd = Gold;
    ddm.code = 0;
    ddm.msg = "Success";
  }
  if (/user\/data/.test($request.url)) {
    ddm = { "msg": "Success", "data": null, "code": 0 };
  }
  obj.status = 200;
  obj.body = JSON.stringify(ddm);
}

$done(obj);

