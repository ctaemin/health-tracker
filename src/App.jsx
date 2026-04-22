import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const TABS = ["대시보드", "체중기록", "인바디", "운동기록"];
const EXERCISE_TYPES = ["실내자전거", "테니스", "골프", "러닝", "수영", "웨이트", "기타"];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0f1e; font-family: 'Pretendard', sans-serif; color: #e8edf5; }
  :root {
    --bg: #0a0f1e;
    --card: #111827;
    --card2: #1a2236;
    --accent: #3b82f6;
    --accent2: #06b6d4;
    --green: #10b981;
    --red: #f43f5e;
    --text: #e8edf5;
    --muted: #64748b;
    --border: #1e2d45;
  }
  .app { max-width: 430px; margin: 0 auto; min-height: 100vh; background: var(--bg); position: relative; }
  .header { padding: 20px 20px 0; display: flex; align-items: center; justify-content: space-between; }
  .header-title { font-size: 22px; font-weight: 700; background: linear-gradient(135deg, #3b82f6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .header-date { font-size: 12px; color: var(--muted); font-family: 'DM Mono', monospace; }
  .tabs { display: flex; padding: 16px 20px 0; gap: 4px; border-bottom: 1px solid var(--border); }
  .tab { flex: 1; text-align: center; padding: 8px 4px; font-size: 12px; font-weight: 500; color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }
  .content { padding: 20px; padding-bottom: 40px; }
  .card { background: var(--card); border-radius: 16px; padding: 16px; margin-bottom: 12px; border: 1px solid var(--border); }
  .card-title { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .stat-item { background: var(--card2); border-radius: 12px; padding: 12px; text-align: center; border: 1px solid var(--border); }
  .stat-value { font-size: 20px; font-weight: 700; font-family: 'DM Mono', monospace; color: var(--text); }
  .stat-label { font-size: 10px; color: var(--muted); margin-top: 2px; }
  .stat-delta { font-size: 10px; margin-top: 4px; font-family: 'DM Mono', monospace; }
  .delta-down { color: var(--green); }
  .delta-up { color: var(--red); }
  .input-group { margin-bottom: 14px; }
  .input-label { font-size: 12px; color: var(--muted); margin-bottom: 6px; display: block; font-weight: 500; }
  .input-field { width: 100%; background: var(--card2); border: 1px solid var(--border); border-radius: 10px; padding: 10px 14px; color: var(--text); font-size: 15px; outline: none; font-family: 'DM Mono', monospace; transition: border-color 0.2s; }
  .input-field:focus { border-color: var(--accent); }
  .btn { width: 100%; padding: 13px; border-radius: 12px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'Pretendard', sans-serif; }
  .btn-primary { background: linear-gradient(135deg, #3b82f6, #06b6d4); color: white; }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-secondary { background: var(--card2); color: var(--text); border: 1px solid var(--border); }
  .exercise-list { display: flex; flex-direction: column; gap: 8px; }
  .exercise-item { background: var(--card2); border-radius: 12px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--border); }
  .exercise-info { display: flex; flex-direction: column; }
  .exercise-type { font-size: 14px; font-weight: 600; color: var(--text); }
  .exercise-detail { font-size: 11px; color: var(--muted); margin-top: 2px; font-family: 'DM Mono', monospace; }
  .exercise-duration { font-size: 16px; font-weight: 700; color: var(--accent); font-family: 'DM Mono', monospace; }
  .exercise-select { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
  .exercise-tag { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; border: 1px solid var(--border); background: var(--card2); color: var(--muted); transition: all 0.2s; }
  .exercise-tag.selected { background: var(--accent); color: white; border-color: var(--accent); }
  .inbody-upload { border: 2px dashed var(--border); border-radius: 16px; padding: 30px; text-align: center; cursor: pointer; transition: all 0.2s; }
  .inbody-upload:hover { border-color: var(--accent); }
  .inbody-upload-icon { font-size: 36px; margin-bottom: 10px; }
  .inbody-upload-text { color: var(--muted); font-size: 13px; }
  .inbody-result { background: var(--card2); border-radius: 12px; padding: 14px; border: 1px solid var(--border); }
  .inbody-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); }
  .inbody-row:last-child { border-bottom: none; }
  .inbody-key { font-size: 13px; color: var(--muted); }
  .inbody-val { font-size: 13px; font-weight: 600; color: var(--text); font-family: 'DM Mono', monospace; }
  .loading-overlay { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px; gap: 12px; }
  .spinner { width: 36px; height: 36px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-size: 13px; color: var(--muted); }
  .score-circle { width: 80px; height: 80px; border-radius: 50%; background: conic-gradient(#3b82f6 0% calc(var(--pct) * 1%), #1e2d45 0%); display: flex; align-items: center; justify-content: center; position: relative; margin: 0 auto 12px; }
  .score-inner { width: 64px; height: 64px; border-radius: 50%; background: var(--card); display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .score-num { font-size: 20px; font-weight: 700; font-family: 'DM Mono', monospace; color: var(--accent); }
  .score-label { font-size: 9px; color: var(--muted); }
  .empty-state { text-align: center; padding: 40px 20px; color: var(--muted); font-size: 13px; }
  .empty-icon { font-size: 40px; margin-bottom: 10px; }
  .history-item { background: var(--card2); border-radius: 10px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border); margin-bottom: 6px; }
  .history-date { font-size: 11px; color: var(--muted); font-family: 'DM Mono', monospace; }
  .history-val { font-size: 15px; font-weight: 700; font-family: 'DM Mono', monospace; }
  .week-summary { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .summary-box { background: var(--card2); border-radius: 12px; padding: 14px; border: 1px solid var(--border); }
  .summary-num { font-size: 24px; font-weight: 700; font-family: 'DM Mono', monospace; color: var(--accent); }
  .summary-desc { font-size: 11px; color: var(--muted); margin-top: 2px; }
  select.input-field { -webkit-appearance: none; }
`;

const today = () => new Date().toISOString().split("T")[0];
const fmtDate = (d) => { const [y,m,day] = d.split("-"); return `${m}/${day}`; };

const SAMPLE_WEIGHTS = [
  { date: "2026-04-09", weight: 76.0, bmi: 27.3, fat: 29.5 },
  { date: "2026-04-14", weight: 75.1, bmi: 26.9, fat: 28.8 },
  { date: "2026-04-15", weight: 75.5, bmi: 27.1, fat: 29.0 },
  { date: "2026-04-17", weight: 75.5, bmi: 27.0, fat: 28.9 },
  { date: "2026-04-20", weight: 74.9, bmi: 26.9, fat: 28.1 },
];

const SAMPLE_EXERCISES = [
  { id: 1, type: "테니스", date: "2026-04-22", duration: 90, memo: "서브 연습" },
  { id: 2, type: "실내자전거", date: "2026-04-21", duration: 40, memo: "" },
  { id: 3, type: "골프", date: "2026-04-20", duration: 120, memo: "드라이버 교정" },
];

export default function App() {
  const [tab, setTab] = useState(0);
  const [weights, setWeights] = useState(SAMPLE_WEIGHTS);
  const [exercises, setExercises] = useState(SAMPLE_EXERCISES);
  const [inbodyRecords, setInbodyRecords] = useState([]);

  // Weight form
  const [wDate, setWDate] = useState(today());
  const [wWeight, setWWeight] = useState("");
  const [wBmi, setWBmi] = useState("");
  const [wFat, setWFat] = useState("");

  // Exercise form
  const [exType, setExType] = useState("실내자전거");
  const [exDate, setExDate] = useState(today());
  const [exDuration, setExDuration] = useState("");
  const [exMemo, setExMemo] = useState("");

  // InBody
  const [inbodyLoading, setInbodyLoading] = useState(false);
  const [inbodyResult, setInbodyResult] = useState(null);
  const [inbodyError, setInbodyError] = useState("");
  const fileRef = useRef();

  const latestWeight = weights.length ? weights[weights.length - 1] : null;
  const prevWeight = weights.length > 1 ? weights[weights.length - 2] : null;
  const weightDelta = latestWeight && prevWeight ? (latestWeight.weight - prevWeight.weight).toFixed(1) : null;

  // This week exercises
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  const thisWeekEx = exercises.filter(e => new Date(e.date) >= weekStart);
  const totalMinutes = thisWeekEx.reduce((a, b) => a + b.duration, 0);

  const addWeight = () => {
    if (!wWeight) return;
    const entry = { date: wDate, weight: parseFloat(wWeight), bmi: parseFloat(wBmi) || 0, fat: parseFloat(wFat) || 0 };
    setWeights(prev => [...prev.filter(w => w.date !== wDate), entry].sort((a,b) => a.date.localeCompare(b.date)));
    setWWeight(""); setWBmi(""); setWFat("");
  };

< truncated lines 145-385 >
        ))}
      </div>
    </div>
  );
}

function InbodyTab({ fileRef, handleInbodyPhoto, inbodyLoading, inbodyResult, inbodyError, inbodyRecords }) {
  return (
    <div>
      <div className="card">
        <div className="card-title">인바디 사진 스캔</div>
        <div className="inbody-upload" onClick={() => fileRef.current?.click()}>
          <div className="inbody-upload-icon">📷</div>
          <div className="inbody-upload-text">인바디 결과지 사진을 찍어 올려주세요<br /><span style={{ fontSize: 11, marginTop: 4, display: "block" }}>AI가 자동으로 데이터를 추출합니다</span></div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleInbodyPhoto} />

        {inbodyLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <div className="loading-text">AI가 인바디 데이터를 분석 중이에요...</div>
          </div>
        )}

        {inbodyError && <div style={{ color: "#f43f5e", fontSize: 13, marginTop: 12, textAlign: "center" }}>{inbodyError}</div>}

        {inbodyResult && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              {inbodyResult.score && (
                <div className="score-circle" style={{ "--pct": inbodyResult.score }}>
                  <div className="score-inner">
                    <div className="score-num">{inbodyResult.score}</div>
                    <div className="score-label">점</div>
                  </div>
                </div>
              )}
              <div style={{ fontSize: 13, color: "#64748b" }}>분석 완료!<br />체중 기록에도 자동 저장됐어요 ✅</div>
            </div>
            <div className="inbody-result">
              {[
                ["측정일", inbodyResult.date],
                ["체중", inbodyResult.weight ? `${inbodyResult.weight} kg` : null],
                ["골격근량", inbodyResult.muscle ? `${inbodyResult.muscle} kg` : null],
                ["체지방량", inbodyResult.fat ? `${inbodyResult.fat} kg` : null],
                ["체지방률", inbodyResult.fatPercent ? `${inbodyResult.fatPercent} %` : null],
                ["BMI", inbodyResult.bmi],
                ["체수분", inbodyResult.water ? `${inbodyResult.water} L` : null],
                ["단백질", inbodyResult.protein ? `${inbodyResult.protein} kg` : null],
                ["기초대사량", inbodyResult.bmr ? `${inbodyResult.bmr} kcal` : null],
                ["내장지방레벨", inbodyResult.visceralFat],
              ].filter(([,v]) => v !== null && v !== undefined).map(([k, v]) => (
                <div key={k} className="inbody-row">
                  <span className="inbody-key">{k}</span>
                  <span className="inbody-val">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {inbodyRecords.length > 0 && (
        <div className="card">
          <div className="card-title">인바디 기록</div>
          {inbodyRecords.map((r, i) => (
            <div key={r.id} className="history-item">
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{r.date}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>체지방 {r.fatPercent}% · 근육 {r.muscle}kg</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#3b82f6", fontFamily: "DM Mono" }}>{r.score}점</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{r.weight}kg</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {inbodyRecords.length === 0 && !inbodyResult && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div>아직 인바디 기록이 없어요<br />사진을 올려서 첫 기록을 추가해보세요!</div>
        </div>
      )}
    </div>
  );
}

function ExerciseTab({ exercises, exType, setExType, exDate, setExDate, exDuration, setExDuration, exMemo, setExMemo, addExercise }) {
  return (
    <div>
      <div className="card">
        <div className="card-title">운동 기록 추가</div>
        <div className="input-group">
          <label className="input-label">운동 종류</label>
          <div className="exercise-select">
            {EXERCISE_TYPES.map(t => (
              <div key={t} className={`exercise-tag ${exType === t ? "selected" : ""}`} onClick={() => setExType(t)}>{t}</div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">날짜</label>
            <input className="input-field" type="date" value={exDate} onChange={e => setExDate(e.target.value)} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">운동 시간 (분)</label>
            <input className="input-field" type="number" placeholder="60" value={exDuration} onChange={e => setExDuration(e.target.value)} />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">메모 (선택)</label>
          <input className="input-field" type="text" placeholder="오늘 운동 느낌..." value={exMemo} onChange={e => setExMemo(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={addExercise}>기록 저장</button>
      </div>

      <div className="card">
        <div className="card-title">운동 기록</div>
        {exercises.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏃</div>
            <div>운동 기록을 추가해보세요!</div>
          </div>
        ) : (
          <div className="exercise-list">
            {exercises.map(ex => (
              <div key={ex.id} className="exercise-item">
                <div className="exercise-info">
                  <div className="exercise-type">{ex.type}</div>
                  <div className="exercise-detail">{ex.date}{ex.memo ? ` · ${ex.memo}` : ""}</div>
                </div>
                <div className="exercise-duration">{ex.duration}분</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
