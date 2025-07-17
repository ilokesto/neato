#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 프로젝트 루트 찾기
function findProjectRoot() {
  let currentDir = process.cwd();
  
  while (currentDir !== path.dirname(currentDir)) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  
  return process.cwd();
}

const projectRoot = findProjectRoot();
const vscodeDir = path.join(projectRoot, '.vscode');
const settingsPath = path.join(vscodeDir, 'settings.json');

// .vscode 디렉토리가 없으면 생성
if (!fs.existsSync(vscodeDir)) {
  fs.mkdirSync(vscodeDir, { recursive: true });
}

// 기존 settings.json 읽기 또는 빈 객체로 초기화
let settings = {};
if (fs.existsSync(settingsPath)) {
  try {
    const content = fs.readFileSync(settingsPath, 'utf8');
    settings = JSON.parse(content);
  } catch (error) {
    console.log('기존 settings.json을 파싱할 수 없어 새로 생성합니다.');
  }
}

// neato를 위한 Tailwind IntelliSense 설정
const neatoSettings = {
  "tailwindCSS.experimental.classRegex": [
    ["neatoVariants\\(([^)]*)\\)", "[\"'`]([^\"'`]*)[\"'`]"],
    ["neato\\(([^)]*)\\)", "[\"'`]([^\"'`]*)[\"'`]"]
  ],
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
};

// 기존 설정과 병합
const existingClassRegex = settings["tailwindCSS.experimental.classRegex"] || [];
const existingIncludeLanguages = settings["tailwindCSS.includeLanguages"] || {};

// 중복 제거하면서 neato 설정 추가
const newClassRegex = [...existingClassRegex];
neatoSettings["tailwindCSS.experimental.classRegex"].forEach(regex => {
  if (!newClassRegex.some(existing => JSON.stringify(existing) === JSON.stringify(regex))) {
    newClassRegex.push(regex);
  }
});

settings["tailwindCSS.experimental.classRegex"] = newClassRegex;
settings["tailwindCSS.includeLanguages"] = {
  ...existingIncludeLanguages,
  ...neatoSettings["tailwindCSS.includeLanguages"]
};

// settings.json 저장
try {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  console.log('✅ neato를 위한 Tailwind IntelliSense 설정이 .vscode/settings.json에 추가되었습니다!');
} catch (error) {
  console.error('❌ settings.json 설정 중 오류가 발생했습니다:', error.message);
}
