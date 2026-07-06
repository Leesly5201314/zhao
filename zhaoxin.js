/*************************************

应用名称：赵云与阿斗-小游戏
脚本功能：辅助小工具
更新日期：2026-07-07
使用声明：仅供参考，禁止转载与售卖！

**************************************

[rewrite_local]
^https?:\/\/.*\.mihuangame\.com\/.+ url script-response-body https://raw.githubusercontent.com/Leesly5201314/zhao/main/zhaoxin.js

[mitm]
hostname = *.mihuangame.com

*************************************/

const Gold = 9999999;
const Stamina = 999999;

function safeJson(body) {
  try { return JSON.parse(body || "{}"); } catch (e) { return null; }
}

var body = $response.body;
var obj = safeJson(body);
if (!obj) { $done({}); }

var modified = false;

// 登录接口：userData 内嵌
if (obj.data && obj.data.userData) {
  var d = obj.data.userData;
  if (d.gd !== undefined) { d.gd = Math.max(d.gd, Gold); modified = true; }
  if (d.sm !== undefined) { d.sm = Stamina; modified = true; }
}

// 直接返回的玩家数据
if (obj.gd !== undefined) { obj.gd = Math.max(obj.gd, Gold); modified = true; }
if (obj.sm !== undefined) { obj.sm = Stamina; modified = true; }

if (modified) {
  $done({ body: JSON.stringify(obj) });
} else {
  $done({});
}
