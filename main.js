// ==UserScript==
// @name         PTA_auto_answer
// @namespace    http://tampermonkey.net/
// @version      2024-08-22
// @description  Automatic answering in U campus
// @author       hjl
// @match        https://pintia.cn/problem-sets/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
// ==/UserScript==


(function () {
  'use strict';

  // const character_settings = '注意：你的回答格式是：answer: [A]\nanalysis: [因为……（简洁精炼，不要超过50字）]\n'

  const problem_types = {
    '2': 'MULTIPLE_CHOICE'
  }

  /**
   * 创建一个新的<link>元素，引入layui的CSS样式表。
   */
  let link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.16/css/layui.min.css'

  document.head.appendChild(link)
  /**
   * 创建一个新的<script>元素，引入layui的JavaScript文件。
   */
  let script = document.createElement('script')
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.16/layui.js'

  /**
   * 当脚本成功加载并执行完成后，调用这个函数，开始刷课。
   */
  script.onload = function () {
    // 加载Layui的element模块
    layui.use('element', function () {
      // initConsoleWindow()
      start()
    })
  }
  document.head.appendChild(script);

  function initConsoleWindow() {
    layer.open({
      type: 1,
      area: ['420px', '760px'],
      offset: 'l',
      id: 'console-window',
      closeBtn: 1,
      title: 'Console',
      shade: 0,
      maxmin: true,
      anim: 2,
      content: '<div style="width: 400px; height: 700px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); font-family: Arial, sans-serif; background: #2b2b2b;"><div style="position: sticky; top: 0; height: 100px; width: 100%; background: #3c3c3c; margin: 0; z-index: 10;"><p style="height: 70px; line-height: 70px; text-align: center; font-size: 20px; color: #ffffff; margin: 0;">PTA_auto_answer</p><p style="height: 30px; color: #aaaaaa; text-align: right; margin: 0; padding-right: 15px;">Hjl_capable&nbsp;&nbsp;&nbsp;</p></div><textarea id="console-log" style="width: 100%; height: 600px; padding: 10px; line-height: 1.5; resize: none; background: #1e1e1e; color: #d1d1d1; border: none; outline: none; font-size: 14px;" readonly></textarea></div>',
      skin: 'layui-layer-molv'
    })
    console.log('----------------start----------------')
  }


  async function start() {
    const cookie = document.cookie
    const info = window.location.href.split('/')
    const problem_type = info[info.length - 1], problem_set_id = info[info.length - 5]

    async function get_info() {
      const problem_sets_id = info[info.length - 5]
      const url = `https://pintia.cn/api/problem-sets/${problem_sets_id}/exams`
      const res = await axios({
        url,
        headers: {
          'cookie': document.cookie
        }
      });
      console.log(res.data['exam']['id']);
      return res.data['exam']['id'];
    }

    async function get_problem_set(problem_set_id, exam_id, problem_type) {
      const url = `https://pintia.cn/api/problem-sets/${problem_set_id}/exam-problems?exam_id=${exam_id}&problem_type=${problem_type}`
      const res = await axios({
        url,
        headers: {
          'cookie': document.cookie
        }
      })
      // res.data.problemSetProblems.forEach(problem => {
      //   const get_choices = (choices) =>
      //       choices.reduce((accumulator, currentValue, index) => {
      //         const letter = String.fromCharCode(65 + index);  // 将索引转换为字母，从 A 开始
      //         return accumulator + `${letter}:${currentValue}\n`;
      //       }, '');
      //
      //   const query = `${character_settings}\n题目：\n${problem.description}\n选项\n${get_choices(problem.problemConfig.multipleChoiceProblemConfig.choices)}\n`
      //   console.log(query)
      // })
      const query = res.data.problemSetProblems.reduce((acc, cur, idx) => {
        const get_choices = (choices) =>
            choices.reduce((acc, cur, idx) => {
              const letter = String.fromCharCode(65 + idx);  // 将索引转换为字母，从 A 开始
              return acc + `${letter}:${cur}\n`;
            }, '');
        return acc + `\n${idx}、${cur.description}\n${get_choices(cur.problemConfig.multipleChoiceProblemConfig.choices)}`
      }, '')
      console.log(query)
    }

    const exam_id = await get_info()
    console.log(exam_id)
    get_problem_set(problem_set_id, exam_id, problem_types[problem_type])
  }
})();