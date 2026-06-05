/**
 * ═══════════════════════════════════════════════════════════════════
 *  TASKLET TEMPLATE GENERATOR
 *  Each planner type gets its own unique, functional PDF layout.
 *  All templates include the Tasklet mascot logo.
 * ═══════════════════════════════════════════════════════════════════
 */
import jsPDF from 'jspdf';
import type { planner_item } from '../data/planners';
import { TASKLET_LOGO_BASE64 } from './logo-base64';

// ── Types ────────────────────────────────────────────────────────
export type paper_size_key = 'A4' | 'Short' | 'Long';

const PAPER: Record<paper_size_key, { w: number; h: number; label: string }> = {
  'A4':    { w: 210, h: 297, label: 'A4 (210×297mm)' },
  'Short': { w: 216, h: 279, label: 'Short Bond (8.5×11")' },
  'Long':  { w: 216, h: 356, label: 'Long Bond (8.5×14")' },
};

// ── Brand Colors ─────────────────────────────────────────────────
const C = {
  deep:    [26, 36, 43]     as [number, number, number],
  steel:   [148, 163, 184]  as [number, number, number],
  cloud:   [245, 247, 250]  as [number, number, number],
  white:   [255, 255, 255]  as [number, number, number],
  line:    [225, 230, 238]  as [number, number, number],
  line_lt: [238, 242, 248]  as [number, number, number],
  muted:   [190, 198, 210]  as [number, number, number],
  navy:    [56, 141, 248]   as [number, number, number],
  green:   [34, 180, 94]    as [number, number, number],
  pink:    [235, 100, 160]  as [number, number, number],
  beige:   [160, 150, 140]  as [number, number, number],
};

const get_accent = (theme: string): [number, number, number] => {
  const map: Record<string, [number, number, number]> = {
    navy: C.navy, green: C.green, pink: C.pink, beige: C.beige
  };
  return map[theme] || C.navy;
};

// ── Shared Helpers ───────────────────────────────────────────────
const M = 15; // margin

function draw_header(doc: jsPDF, pw: number, accent: [number, number, number], title: string, subtitle: string) {
  // Ultra-minimalist header
  
  // Logo image - scaled beautifully
  try {
    doc.addImage(TASKLET_LOGO_BASE64, 'PNG', M, 10, 11, 11);
  } catch (_) { /* fallback if logo fails */ }

  // Brand text next to logo
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.deep);
  doc.text('TASKLET', M + 14, 14);
  
  doc.setFontSize(4.5);
  doc.setTextColor(...C.steel);
  // Replaced "STUDY TEMPLATE" to fit a more premium workspace tone
  doc.text('ACADEMIC ESSENTIAL', M + 14, 18);

  // Focus Badge on the right
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...accent);
  const badgeText = subtitle.toUpperCase();
  const badgeW = doc.getTextWidth(badgeText) + 8;
  // Very subtle background badge for subtitle
  doc.setFillColor(...C.cloud);
  doc.roundedRect(pw - M - badgeW, 11, badgeW, 7, 1, 1, 'F');
  doc.text(badgeText, pw - M - badgeW + 4, 16);

  // Document Title (Left, prominent & clean)
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.deep);
  doc.text(title, M, 34);

  // Name & Date form fields (Right, aligned cleanly)
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.muted);
  doc.text('Name:', pw - M - 65, 29);
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.15);
  doc.line(pw - M - 52, 29, pw - M, 29);

  doc.text('Date:', pw - M - 65, 35);
  doc.line(pw - M - 52, 35, pw - M, 35);

  // Sleek minimalist structural divider
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.2);
  doc.line(M, 42, pw - M, 42);
  
  // Highlighting accent dot/line that grounds the title
  doc.setFillColor(...accent);
  doc.rect(M, 41.5, 14, 1, 'F');

  return 52; // clean y position return after header
}

function draw_footer(doc: jsPDF, pw: number, ph: number, accent: [number, number, number], label: string) {
  const fy = ph - 12;
  doc.setDrawColor(...C.deep);
  doc.setLineWidth(0.4);
  doc.line(M, fy, pw - M, fy);

  // Accent dot
  doc.setFillColor(...accent);
  doc.circle(pw / 2, fy + 5, 1, 'F');

  doc.setFontSize(5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.deep);
  doc.text('TASKLET Learnify', M, fy + 5);

  doc.setTextColor(...C.muted);
  doc.text(label, M, fy + 8.5);
  doc.text(`© ${new Date().getFullYear()} TASKLET`, pw - M, fy + 5, { align: 'right' });
}

function draw_section_title(doc: jsPDF, y: number, title: string, accent: [number, number, number]) {
  // Minimalist accent bar instead of heavy box
  doc.setFillColor(...accent);
  doc.rect(M, y - 0.5, 1.5, 5.5, 'F');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.deep);
  doc.text(title.toUpperCase(), M + 4, y + 4);
  return y + 8;
}

function draw_lined_box(doc: jsPDF, x: number, y: number, w: number, h: number, line_spacing = 6.5) {
  // Pure, airy minimalist border mapping
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.15);
  doc.roundedRect(x, y, w, h, 1.5, 1.5, 'S');

  doc.setDrawColor(...C.line_lt);
  doc.setLineWidth(0.1);
  const count = Math.floor((h - 6) / line_spacing);
  for (let i = 1; i <= count; i++) {
    doc.line(x + 3, y + 3 + i * line_spacing, x + w - 3, y + 3 + i * line_spacing);
  }
}

function draw_checkbox_row(doc: jsPDF, x: number, y: number, w: number, label: string) {
  // Checkbox
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.25);
  doc.setFillColor(...C.white);
  doc.roundedRect(x, y, 4, 4, 0.6, 0.6, 'FD');

  // Label
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.deep);
  doc.text(label, x + 6, y + 3);

  // Dotted line
  doc.setDrawColor(...C.line_lt);
  doc.setLineWidth(0.12);
  const text_end = x + 6 + doc.getTextWidth(label) + 2;
  doc.line(text_end, y + 3.5, x + w, y + 3.5);
}


// ═══════════════════════════════════════════════════════════════════
//  1. DAILY PLANNER — Time-blocked schedule with priorities
// ═══════════════════════════════════════════════════════════════════
function layout_daily(doc: jsPDF, planner: planner_item, pw: number, ph: number, accent: [number, number, number]) {
  let y = draw_header(doc, pw, accent, planner.title, 'Daily Schedule');
  const cw = pw - M * 2; // content width

  // ── Column dimensions
  const col_left_w = cw * 0.56;
  const col_gap = cw * 0.04;
  const col_right_w = cw - col_left_w - col_gap;
  const col_right_x = M + col_left_w + col_gap;

  // ══════════════════════════════════════════════
  //  LEFT COLUMN: Schedule
  // ══════════════════════════════════════════════

  // Schedule section label
  doc.setFillColor(...accent);
  doc.rect(M, y - 0.5, 1.5, 5.5, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.deep);
  doc.text('SCHEDULE', M + 4, y + 4);

  const schedule_y = y + 10;

  const hours = ['6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM',
                 '1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM',
                 '8:00 PM','9:00 PM','10:00 PM'];
  
  const row_h = Math.min(12, (ph - schedule_y - 30) / hours.length);

  hours.forEach((hour, i) => {
    const ry = schedule_y + i * row_h;
    
    // Alternate row fill
    if (i % 2 === 0) {
      doc.setFillColor(...C.cloud);
      doc.rect(M, ry, col_left_w, row_h, 'F');
    }

    // Separator
    doc.setDrawColor(...C.line_lt);
    doc.setLineWidth(0.1);
    doc.line(M, ry + row_h, M + col_left_w, ry + row_h);

    // Time label
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.steel);
    doc.text(hour, M + 1.5, ry + row_h * 0.6);

    // Divider between time and content
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.15);
    doc.line(M + 20, ry, M + 20, ry + row_h);
  });

  // Border around schedule
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.2);
  doc.roundedRect(M, schedule_y, col_left_w, hours.length * row_h, 1.5, 1.5, 'S');

  // ══════════════════════════════════════════════
  //  RIGHT COLUMN: Priorities, Goals, Notes
  // ══════════════════════════════════════════════

  // -- TOP 3 PRIORITIES heading (right column)
  doc.setFillColor(...accent);
  doc.rect(col_right_x, y - 0.5, 1.5, 5.5, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.deep);
  doc.text('TOP 3 PRIORITIES', col_right_x + 4, y + 4);

  const pri_y = y + 10;
  for (let i = 0; i < 3; i++) {
    const py = pri_y + i * 11;
    doc.setFillColor(...accent);
    doc.circle(col_right_x + 2.5, py + 2.5, 2.5, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.white);
    doc.text(String(i + 1), col_right_x + 1.5, py + 4);

    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.15);
    doc.line(col_right_x + 7, py + 4, col_right_x + col_right_w, py + 4);
  }

  // -- DAILY GOALS (right column middle)
  const goals_y = pri_y + 40;
  doc.setFillColor(...accent);
  doc.rect(col_right_x, goals_y - 0.5, 1.5, 5.5, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.deep);
  doc.text('DAILY GOALS', col_right_x + 4, goals_y + 4);

  draw_lined_box(doc, col_right_x, goals_y + 8, col_right_w, 45);

  // -- NOTES / REFLECTION (right column bottom)
  const notes_y = goals_y + 58;
  doc.setFillColor(...accent);
  doc.rect(col_right_x, notes_y - 0.5, 1.5, 5.5, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.deep);
  doc.text('REFLECTION & NOTES', col_right_x + 4, notes_y + 4);

  const notes_h = Math.max(30, schedule_y + hours.length * row_h - notes_y - 12);
  draw_lined_box(doc, col_right_x, notes_y + 8, col_right_w, notes_h);

  // -- WATER TRACKER (bottom, spanning full width)
  const water_y = schedule_y + hours.length * row_h + 6;
  if (water_y + 14 < ph - 16) {
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.steel);
    doc.text('WATER INTAKE', M, water_y + 2);

    for (let i = 0; i < 8; i++) {
      doc.setDrawColor(...C.line);
      doc.setFillColor(...C.white);
      doc.setLineWidth(0.2);
      doc.circle(M + 28 + i * 9, water_y + 1.5, 3, 'FD');
      doc.setFillColor(150, 190, 220);
      doc.circle(M + 28 + i * 9, water_y + 1.5, 1.5, 'F');
    }
  }
}


// ═══════════════════════════════════════════════════════════════════
//  2. WEEKLY PLANNER — 7-day column grid with goals
// ═══════════════════════════════════════════════════════════════════
function layout_weekly(doc: jsPDF, planner: planner_item, pw: number, ph: number, accent: [number, number, number]) {
  let y = draw_header(doc, pw, accent, planner.title, 'Week-at-a-Glance');
  const cw = pw - M * 2;

  // -- WEEKLY GOALS (top row)
  y = draw_section_title(doc, y, 'Weekly Goals', accent);
  for (let i = 0; i < 3; i++) {
    draw_checkbox_row(doc, M + 2, y + i * 7, cw * 0.45, `Goal ${i + 1}: `);
  }

  // Motivational quote box on right
  doc.setFillColor(...C.cloud);
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.2);
  const qx = M + cw * 0.52;
  doc.roundedRect(qx, y - 2, cw * 0.48, 20, 2, 2, 'FD');
  doc.setFontSize(6);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...C.steel);
  doc.text('"This week I will focus on..."', qx + 4, y + 5);
  draw_lined_box(doc, qx + 2, y + 8, cw * 0.44, 8, 7);

  y += 26;

  // -- 7-DAY GRID
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const grid_h = ph - y - 50;  // remaining space minus footer and habit tracker
  const col_w = cw / 4;        // 4 columns, 2 rows
  const row_h = grid_h / 2;

  days.forEach((day, i) => {
    let cx: number, cy: number, cell_w: number, cell_h: number;

    if (i < 4) {
      // First row: Mon-Thu
      cx = M + i * col_w;
      cy = y;
      cell_w = col_w;
      cell_h = row_h;
    } else {
      // Second row: Fri-Sun (3 cells, wider)
      const bot_col_w = cw / 3;
      cx = M + (i - 4) * bot_col_w;
      cy = y + row_h;
      cell_w = bot_col_w;
      cell_h = row_h;
    }

    // Cell border
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.2);
    doc.setFillColor(...C.white);
    doc.roundedRect(cx + 0.5, cy + 0.5, cell_w - 1, cell_h - 1, 1.5, 1.5, 'FD');

    // Day header
    doc.setFillColor(...(i < 5 ? accent : C.steel));
    doc.roundedRect(cx + 0.5, cy + 0.5, cell_w - 1, 7, 1.5, 1.5, 'F');
    // Cover bottom corners of header
    doc.rect(cx + 0.5, cy + 5, cell_w - 1, 3, 'F');

    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.white);
    doc.text(day, cx + 3, cy + 5.5);

    // Writing lines inside cell
    doc.setDrawColor(...C.line_lt);
    doc.setLineWidth(0.1);
    const num_lines = Math.floor((cell_h - 14) / 6);
    for (let l = 0; l < num_lines; l++) {
      doc.line(cx + 3, cy + 12 + l * 6, cx + cell_w - 3, cy + 12 + l * 6);
    }
  });

  // -- HABIT TRACKER (bottom)
  const habit_y = y + row_h * 2 + 4;
  if (habit_y + 15 < ph - 14) {
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.deep);
    doc.text('HABIT TRACKER', M, habit_y + 2);

    const habits = ['Exercise', 'Reading', 'Water', 'Sleep 8h'];
    const ht_col_w = cw / habits.length;
    habits.forEach((h, i) => {
      const hx = M + i * ht_col_w;
      doc.setFontSize(5.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...C.steel);
      doc.text(h, hx + 2, habit_y + 8);

      // 7 small circles for each day
      for (let d = 0; d < 7; d++) {
        doc.setDrawColor(...C.line);
        doc.setFillColor(...C.white);
        doc.setLineWidth(0.15);
        doc.circle(hx + 2 + d * 4.5, habit_y + 13, 1.5, 'FD');
      }
    });
  }
}


// ═══════════════════════════════════════════════════════════════════
//  3. TO-DO LIST — Checkbox list with priority & deadline columns
// ═══════════════════════════════════════════════════════════════════
function layout_todo(doc: jsPDF, planner: planner_item, pw: number, ph: number, accent: [number, number, number]) {
  let y = draw_header(doc, pw, accent, planner.title, 'Task Management');
  const cw = pw - M * 2;

  // Quick stats row
  y = draw_section_title(doc, y, 'Overview', accent);
  const stat_boxes = ['Total Tasks', 'Completed', 'In Progress', 'Pending'];
  const sb_w = cw / stat_boxes.length;
  stat_boxes.forEach((s, i) => {
    const sx = M + i * sb_w;
    doc.setFillColor(...C.cloud);
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.2);
    doc.roundedRect(sx + 1, y, sb_w - 2, 14, 2, 2, 'FD');
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.steel);
    doc.text(s.toUpperCase(), sx + sb_w / 2, y + 4, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(...C.deep);
    doc.text('___', sx + sb_w / 2, y + 11, { align: 'center' });
  });
  y += 20;

  // ── Table header
  const cols = [
    { label: '[ ]',       w: 8 },
    { label: 'PRIORITY', w: 18 },
    { label: 'TASK DESCRIPTION', w: cw - 8 - 18 - 28 - 22 },
    { label: 'DEADLINE', w: 28 },
    { label: 'STATUS', w: 22 },
  ];

  // Header row
  doc.setFillColor(...C.deep);
  doc.roundedRect(M, y, cw, 7, 1.5, 1.5, 'F');
  // Cover bottom corners
  doc.rect(M, y + 4, cw, 3, 'F');

  let col_x = M;
  cols.forEach(col => {
    doc.setFontSize(4.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.white);
    doc.text(col.label, col_x + 2, y + 4.5);
    col_x += col.w;
  });
  y += 7;

  // ── Table rows
  const row_count = Math.floor((ph - y - 45) / 9);
  for (let r = 0; r < row_count; r++) {
    const ry = y + r * 9;

    // Alternate fill
    if (r % 2 === 0) {
      doc.setFillColor(...C.cloud);
      doc.rect(M, ry, cw, 9, 'F');
    }

    // Row border
    doc.setDrawColor(...C.line_lt);
    doc.setLineWidth(0.1);
    doc.line(M, ry + 9, M + cw, ry + 9);

    // Checkbox
    doc.setDrawColor(...C.line);
    doc.setFillColor(...C.white);
    doc.setLineWidth(0.2);
    doc.roundedRect(M + 2, ry + 2.5, 4, 4, 0.5, 0.5, 'FD');

    // Priority circle
    doc.setDrawColor(...C.line);
    doc.setFillColor(...C.white);
    doc.circle(M + cols[0].w + 8, ry + 4.5, 2.5, 'FD');

    // Column dividers
    let dx = M;
    cols.forEach(col => {
      dx += col.w;
      doc.setDrawColor(...C.line_lt);
      doc.setLineWidth(0.1);
      doc.line(dx, ry, dx, ry + 9);
    });
  }

  // Table outer border
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.25);
  doc.roundedRect(M, y - 7, cw, 7 + row_count * 9, 1.5, 1.5, 'S');

  // ── Priority Legend
  const legend_y = y + row_count * 9 + 6;
  doc.setFontSize(5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.steel);
  doc.text('PRIORITY:', M, legend_y);
  const levels = [
    { label: 'HIGH', color: [220, 50, 50] as [number, number, number] },
    { label: 'MEDIUM', color: [240, 170, 50] as [number, number, number] },
    { label: 'LOW', color: [50, 180, 100] as [number, number, number] },
  ];
  levels.forEach((lv, i) => {
    const lx = M + 18 + i * 22;
    doc.setFillColor(...lv.color);
    doc.circle(lx, legend_y - 1, 1.5, 'F');
    doc.setFontSize(5);
    doc.setTextColor(...C.deep);
    doc.text(lv.label, lx + 3, legend_y);
  });

  // ── Notes section
  const notes_y = legend_y + 6;
  if (notes_y + 20 < ph - 14) {
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.deep);
    doc.text('NOTES', M, notes_y + 2);
    draw_lined_box(doc, M, notes_y + 5, cw, ph - notes_y - 22, 6);
  }
}


// ═══════════════════════════════════════════════════════════════════
//  4. STUDY SESSION LOG — Table tracker for sessions
// ═══════════════════════════════════════════════════════════════════
function layout_study_log(doc: jsPDF, planner: planner_item, pw: number, ph: number, accent: [number, number, number]) {
  let y = draw_header(doc, pw, accent, planner.title, 'Session Tracker');
  const cw = pw - M * 2;

  // ── Weekly summary boxes
  y = draw_section_title(doc, y, 'Weekly Summary', accent);
  const summaries = ['Total Hours', 'Sessions', 'Best Subject', 'Avg. Focus'];
  const sum_w = cw / summaries.length;
  summaries.forEach((s, i) => {
    const sx = M + i * sum_w;
    doc.setFillColor(...C.cloud);
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.2);
    doc.roundedRect(sx + 1, y, sum_w - 2, 16, 2, 2, 'FD');
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.steel);
    doc.text(s.toUpperCase(), sx + sum_w / 2, y + 5, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(...C.deep);
    doc.text('___', sx + sum_w / 2, y + 13, { align: 'center' });
  });
  y += 22;

  // ── Session Log Table
  const table_cols = [
    { label: 'DATE',     w: 22 },
    { label: 'SUBJECT',  w: cw - 22 - 18 - 18 - 18 - 22 - 14 },
    { label: 'START',    w: 18 },
    { label: 'END',      w: 18 },
    { label: 'DURATION', w: 18 },
    { label: 'FOCUS (1-5)', w: 22 },
    { label: 'DONE', w: 14 },
  ];

  // Header
  doc.setFillColor(...C.deep);
  doc.roundedRect(M, y, cw, 7, 1.5, 1.5, 'F');
  doc.rect(M, y + 4, cw, 3, 'F');

  let cx = M;
  table_cols.forEach(col => {
    doc.setFontSize(4);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.white);
    doc.text(col.label, cx + 2, y + 4.5);
    cx += col.w;
  });
  y += 7;

  // Rows
  const row_count = Math.floor((ph - y - 55) / 9);
  for (let r = 0; r < row_count; r++) {
    const ry = y + r * 9;

    if (r % 2 === 0) {
      doc.setFillColor(...C.cloud);
      doc.rect(M, ry, cw, 9, 'F');
    }

    doc.setDrawColor(...C.line_lt);
    doc.setLineWidth(0.1);
    doc.line(M, ry + 9, M + cw, ry + 9);

    // Column dividers
    let dx = M;
    table_cols.forEach(col => {
      dx += col.w;
      doc.setDrawColor(...C.line_lt);
      doc.setLineWidth(0.1);
      doc.line(dx, ry, dx, ry + 9);
    });

    // Checkbox in DONE column
    const done_x = M + cw - 14;
    doc.setDrawColor(...C.line);
    doc.setFillColor(...C.white);
    doc.setLineWidth(0.2);
    doc.roundedRect(done_x + 5, ry + 2.5, 4, 4, 0.5, 0.5, 'FD');

    // Focus rating circles
    const focus_x = done_x - 22;
    for (let s = 0; s < 5; s++) {
      doc.setDrawColor(...C.line);
      doc.setFillColor(...C.white);
      doc.setLineWidth(0.15);
      doc.circle(focus_x + 3 + s * 4, ry + 4.5, 1.5, 'FD');
    }
  }

  // Table border
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.25);
  doc.roundedRect(M, y - 7, cw, 7 + row_count * 9, 1.5, 1.5, 'S');

  // ── Reflection
  const ref_y = y + row_count * 9 + 6;
  if (ref_y + 25 < ph - 14) {
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.deep);
    doc.text('SESSION REFLECTIONS', M, ref_y + 2);
    draw_lined_box(doc, M, ref_y + 5, cw, ph - ref_y - 22, 6.5);
  }
}


// ═══════════════════════════════════════════════════════════════════
//  5. RESEARCH ROADMAP — Phased steps with milestones
// ═══════════════════════════════════════════════════════════════════
function layout_research(doc: jsPDF, planner: planner_item, pw: number, ph: number, accent: [number, number, number]) {
  let y = draw_header(doc, pw, accent, planner.title, 'Academic Research');
  const cw = pw - M * 2;

  // ── Research Topic box
  y = draw_section_title(doc, y, 'Research Topic', accent);
  draw_lined_box(doc, M, y, cw, 14, 6);
  y += 18;

  // ── Thesis Statement
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.deep);
  doc.text('THESIS STATEMENT', M, y);
  y += 3;
  draw_lined_box(doc, M, y, cw, 14, 6);
  y += 18;

  // ── Research Phases
  const phases = [
    { title: 'Phase 1: Topic Selection & Scope', tasks: ['Define research question', 'Set scope & boundaries', 'Identify keywords', 'Preliminary search'] },
    { title: 'Phase 2: Literature Review', tasks: ['Gather primary sources', 'Gather secondary sources', 'Annotate key findings', 'Identify gaps in research'] },
    { title: 'Phase 3: Data Collection & Analysis', tasks: ['Choose methodology', 'Collect data / evidence', 'Organize findings', 'Analyze results'] },
    { title: 'Phase 4: Writing & Drafting', tasks: ['Write introduction', 'Write body / arguments', 'Write conclusion', 'Add citations (APA/MLA)'] },
    { title: 'Phase 5: Review & Submit', tasks: ['Self-review / proofread', 'Peer review feedback', 'Final revisions', 'Submit / present'] },
  ];

  const phase_h = Math.min(38, (ph - y - 22) / phases.length);

  phases.forEach((phase, pi) => {
    if (y + phase_h > ph - 16) return; // skip if no space

    // Phase container
    doc.setFillColor(...(pi % 2 === 0 ? C.cloud : C.white));
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.2);
    doc.roundedRect(M, y, cw, phase_h - 2, 2, 2, 'FD');

    // Phase number badge
    doc.setFillColor(...accent);
    doc.roundedRect(M + 3, y + 3, 6, 6, 1, 1, 'F');
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.white);
    doc.text(String(pi + 1), M + 4.8, y + 7.5);

    // Phase title
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.deep);
    doc.text(phase.title.toUpperCase(), M + 12, y + 7.5);

    // Left side: accent bar
    doc.setFillColor(...accent);
    doc.rect(M, y, 2, phase_h - 2, 'F');

    // Phase tasks as checkboxes - 2 columns
    const half = Math.ceil(phase.tasks.length / 2);
    phase.tasks.forEach((task, ti) => {
      const tx = ti < half ? M + 5 : M + cw / 2;
      const ty = y + 12 + (ti % half) * 6.5;

      doc.setDrawColor(...C.line);
      doc.setFillColor(...C.white);
      doc.setLineWidth(0.2);
      doc.roundedRect(tx, ty, 3.5, 3.5, 0.4, 0.4, 'FD');

      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...C.deep);
      doc.text(task, tx + 5, ty + 2.8);
    });

    // Status / deadline fields on right
    doc.setFontSize(4.5);
    doc.setTextColor(...C.muted);
    doc.text('Deadline: ___/___/___', M + cw - 35, y + 7.5);

    y += phase_h;
  });
}


// ═══════════════════════════════════════════════════════════════════
//  6. ASSIGNMENT TRACKER — Monitor tasks, deadlines and grades
// ═══════════════════════════════════════════════════════════════════
function layout_assignment_tracker(doc: jsPDF, planner: planner_item, pw: number, ph: number, accent: [number, number, number]) {
  let y = draw_header(doc, pw, accent, planner.title, 'Coursework Dashboard');
  const cw = pw - M * 2;

  // ── Semester Overview boxes
  y = draw_section_title(doc, y, 'Semester Overview', accent);
  const overviews = ['Total Subjects', 'Pending Tasks', 'Overdue', 'Completed'];
  const ov_w = cw / overviews.length;
  overviews.forEach((o, i) => {
    const ox = M + i * ov_w;
    doc.setFillColor(...C.cloud);
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.2);
    doc.roundedRect(ox + 1, y, ov_w - 2, 14, 2, 2, 'FD');
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.steel);
    doc.text(o.toUpperCase(), ox + ov_w / 2, y + 4, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(...C.deep);
    doc.text('___', ox + ov_w / 2, y + 11, { align: 'center' });
  });
  y += 20;

  // ── Tracker Table
  const cols = [
    { label: 'SUBJECT / COURSE', w: 25 },
    { label: 'ASSIGNMENT DESCRIPTION', w: cw - 25 - 28 - 22 - 20 },
    { label: 'DUE DATE', w: 28 },
    { label: 'STATUS', w: 22 },
    { label: 'GRADE / SCORE', w: 20 },
  ];

  // Header row
  doc.setFillColor(...C.deep);
  doc.roundedRect(M, y, cw, 7, 1.5, 1.5, 'F');
  doc.rect(M, y + 4, cw, 3, 'F');

  let col_x = M;
  cols.forEach(col => {
    doc.setFontSize(4.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.white);
    doc.text(col.label, col_x + 2, y + 4.5);
    col_x += col.w;
  });
  y += 7;

  // ── Table rows
  const row_count = Math.floor((ph - y - 45) / 10);
  for (let r = 0; r < row_count; r++) {
    const ry = y + r * 10;

    // Alternate fill
    if (r % 2 === 0) {
      doc.setFillColor(...C.cloud);
      doc.rect(M, ry, cw, 10, 'F');
    }

    doc.setDrawColor(...C.line_lt);
    doc.setLineWidth(0.1);
    doc.line(M, ry + 10, M + cw, ry + 10);

    // Column dividers
    let dx = M;
    cols.forEach(col => {
      dx += col.w;
      doc.setDrawColor(...C.line_lt);
      doc.setLineWidth(0.1);
      doc.line(dx, ry, dx, ry + 10);
    });
    
    // Status circles
    const status_x = M + cols[0].w + cols[1].w + cols[2].w;
    doc.setDrawColor(...C.line);
    doc.setFillColor(...C.white);
    doc.circle(status_x + 5, ry + 5, 2, 'FD'); // Not started
    doc.circle(status_x + 11, ry + 5, 2, 'FD'); // In progress
    doc.circle(status_x + 17, ry + 5, 2, 'FD'); // Done
  }

  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.25);
  doc.roundedRect(M, y - 7, cw, 7 + row_count * 10, 1.5, 1.5, 'S');

  // Status Legend
  const legend_y = y + row_count * 10 + 6;
  doc.setFontSize(5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.steel);
  doc.text('STATUS LEGEND:', M, legend_y);
  
  const lx = M + 22;
  doc.setDrawColor(...C.line);
  doc.setFillColor(...C.white);
  doc.circle(lx, legend_y - 1, 1.5, 'FD');
  doc.setTextColor(...C.deep);
  doc.text('NOT STARTED', lx + 3, legend_y);
  
  doc.setFillColor(...C.steel);
  doc.circle(lx + 25, legend_y - 1, 1.5, 'FD');
  doc.text('IN PROGRESS', lx + 28, legend_y);
  
  doc.setFillColor(accent[0], accent[1], accent[2]);
  doc.circle(lx + 50, legend_y - 1, 1.5, 'FD');
  doc.text('COMPLETED', lx + 53, legend_y);

  // Notes section
  const notes_y = legend_y + 8;
  if (notes_y + 20 < ph - 14) {
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.deep);
    doc.text('IMPORTANT REMINDERS', M, notes_y + 2);
    draw_lined_box(doc, M, notes_y + 5, cw, ph - notes_y - 22, 6.5);
  }
}


// ═══════════════════════════════════════════════════════════════════
//  GENERIC FALLBACK — For any future unrecognized templates
// ═══════════════════════════════════════════════════════════════════
function layout_generic(doc: jsPDF, planner: planner_item, pw: number, ph: number, accent: [number, number, number]) {
  let y = draw_header(doc, pw, accent, planner.title, planner.type);
  const cw = pw - M * 2;

  // Description
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.steel);
  const desc = doc.splitTextToSize(planner.description, cw);
  doc.text(desc, M, y);
  y += desc.length * 4.5 + 6;

  // Feature sections
  planner.features.forEach((feature, i) => {
    const section_h = Math.min(45, (ph - y - 20) / (planner.features.length - i));
    if (y + section_h > ph - 16) return;

    y = draw_section_title(doc, y, feature, accent);
    draw_lined_box(doc, M, y, cw, section_h - 10, 6.5);
    y += section_h - 6;
  });
}


// ═══════════════════════════════════════════════════════════════════
//  PUBLIC API: generate_pdf
// ═══════════════════════════════════════════════════════════════════
export const generate_pdf = (planner: planner_item, size_key: paper_size_key, preview_only: boolean = false): string | void => {
  const paper = PAPER[size_key] || PAPER['A4'];
  const accent = get_accent(planner.color_theme);
  const pw = paper.w;
  const ph = paper.h;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pw, ph] });

  // Route to the correct layout
  const layout_map: Record<string, typeof layout_generic> = {
    'daily-planner': layout_daily,
    'weekly-planner': layout_weekly,
    'todo-list': layout_todo,
    'study-session-log': layout_study_log,
    'research-checklist': layout_research,
    'assignment-tracker': layout_assignment_tracker,
  };

  const render = layout_map[planner.id] || layout_generic;
  render(doc, planner, pw, ph, accent);
  draw_footer(doc, pw, ph, accent, `${planner.title} • ${paper.label}`);

  if (preview_only) {
    return doc.output('datauristring');
  }

  doc.save(`${planner.title.toLowerCase().replace(/\s+/g, '-')}-${size_key.toLowerCase()}.pdf`);
};


// ═══════════════════════════════════════════════════════════════════
//  PUBLIC API: generate_docx
// ═══════════════════════════════════════════════════════════════════
export const generate_docx = (planner: planner_item, size_key: paper_size_key) => {
  const paper = PAPER[size_key] || PAPER['A4'];

  const accent_map: Record<string, string> = {
    navy: '#388DF8', green: '#22B45E', beige: '#A0968C', pink: '#EB64A0',
  };
  const accent = accent_map[planner.color_theme] || '#1A242B';

  // Build sections HTML matching the planner type
  let sections_html = '';

  if (planner.id === 'daily-planner') {
    const hours = ['6 AM','7 AM','8 AM','9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM','6 PM','7 PM','8 PM','9 PM'];
    sections_html = `
      <h3 style="color:${accent};font-size:11px;letter-spacing:2px;">TOP 3 PRIORITIES</h3>
      <ol>${[1,2,3].map(() => `<li style="margin-bottom:8px;border-bottom:1px solid #EBF0F5;padding-bottom:4px;">_______________________________________</li>`).join('')}</ol>
      <h3 style="color:${accent};font-size:11px;letter-spacing:2px;margin-top:16px;">DAILY SCHEDULE</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="width:100%;border-collapse:collapse;border-color:#E1E6EE;font-size:10px;">
        ${hours.map((h,i) => `<tr style="background:${i%2===0?'#F5F7FA':'white'}"><td style="width:60px;font-weight:bold;color:#94A3B8;font-size:9px;">${h}</td><td>&nbsp;</td></tr>`).join('')}
      </table>
      <h3 style="color:${accent};font-size:11px;letter-spacing:2px;margin-top:16px;">NOTES & REFLECTION</h3>
      <div style="border:1px solid #E1E6EE;border-radius:4px;padding:12px;min-height:80px;background:#F5F7FA;">&nbsp;</div>
    `;
  } else if (planner.id === 'weekly-planner') {
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    sections_html = `
      <h3 style="color:${accent};font-size:11px;letter-spacing:2px;">WEEKLY GOALS</h3>
      <ul>${[1,2,3].map(() => `<li style="margin-bottom:6px;">☐ _________________________________________</li>`).join('')}</ul>
      <h3 style="color:${accent};font-size:11px;letter-spacing:2px;margin-top:12px;">WEEKLY PLAN</h3>
      <table border="1" cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;border-color:#E1E6EE;font-size:10px;">
        ${days.map((d,i) => `<tr style="background:${i%2===0?'#F5F7FA':'white'}"><td style="width:80px;font-weight:bold;color:#1A242B;font-size:9px;">${d}</td><td style="min-height:30px;">&nbsp;<br/>&nbsp;</td></tr>`).join('')}
      </table>
    `;
  } else if (planner.id === 'todo-list') {
    sections_html = `
      <h3 style="color:${accent};font-size:11px;letter-spacing:2px;">TASK LIST</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="width:100%;border-collapse:collapse;border-color:#E1E6EE;font-size:9px;">
        <tr style="background:#1A242B;color:white;"><td style="width:20px;">✓</td><td style="width:50px;">PRIORITY</td><td>TASK DESCRIPTION</td><td style="width:70px;">DEADLINE</td><td style="width:50px;">STATUS</td></tr>
        ${Array.from({length:20},(_,i) => `<tr style="background:${i%2===0?'#F5F7FA':'white'}"><td>☐</td><td>○</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>`).join('')}
      </table>
    `;
  } else if (planner.id === 'study-session-log') {
    sections_html = `
      <h3 style="color:${accent};font-size:11px;letter-spacing:2px;">SESSION LOG</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;border-color:#E1E6EE;font-size:9px;">
        <tr style="background:#1A242B;color:white;"><td>DATE</td><td>SUBJECT</td><td>START</td><td>END</td><td>DURATION</td><td>FOCUS</td></tr>
        ${Array.from({length:18},(_,i) => `<tr style="background:${i%2===0?'#F5F7FA':'white'}"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>○○○○○</td></tr>`).join('')}
      </table>
      <h3 style="color:${accent};font-size:11px;letter-spacing:2px;margin-top:14px;">REFLECTIONS</h3>
      <div style="border:1px solid #E1E6EE;border-radius:4px;padding:12px;min-height:60px;background:#F5F7FA;">&nbsp;</div>
    `;
  } else if (planner.id === 'research-checklist') {
    const phases = [
      { name: 'Topic Selection & Scope', tasks: ['Define research question','Set scope & boundaries','Identify keywords','Preliminary search'] },
      { name: 'Literature Review', tasks: ['Gather primary sources','Gather secondary sources','Annotate key findings','Identify gaps'] },
      { name: 'Data Collection & Analysis', tasks: ['Choose methodology','Collect data','Organize findings','Analyze results'] },
      { name: 'Writing & Drafting', tasks: ['Write introduction','Write body','Write conclusion','Add citations'] },
      { name: 'Review & Submit', tasks: ['Self-review','Peer review','Final revisions','Submit'] },
    ];
    sections_html = `
      <h3 style="color:${accent};font-size:11px;letter-spacing:2px;">RESEARCH TOPIC</h3>
      <div style="border:1px solid #E1E6EE;border-radius:4px;padding:10px;min-height:30px;background:#F5F7FA;margin-bottom:8px;">&nbsp;</div>
      <h3 style="color:${accent};font-size:11px;letter-spacing:2px;">THESIS STATEMENT</h3>
      <div style="border:1px solid #E1E6EE;border-radius:4px;padding:10px;min-height:30px;background:#F5F7FA;margin-bottom:12px;">&nbsp;</div>
      ${phases.map((p,i) => `
        <div style="border:1px solid #E1E6EE;border-radius:6px;padding:12px;margin-bottom:10px;border-left:3px solid ${accent};background:${i%2===0?'#F5F7FA':'white'};">
          <strong style="color:#1A242B;font-size:10px;">PHASE ${i+1}: ${p.name.toUpperCase()}</strong>
          <div style="margin-top:6px;">${p.tasks.map(t => `<div style="margin-bottom:4px;">☐ ${t}</div>`).join('')}</div>
          <div style="font-size:8px;color:#BEC6D2;margin-top:6px;">Deadline: ___/___/___</div>
        </div>
      `).join('')}
    `;
  } else if (planner.id === 'assignment-tracker') {
    sections_html = `
      <h3 style="color:${accent};font-size:11px;letter-spacing:2px;">SEMESTER OVERVIEW</h3>
      <table border="0" cellpadding="8" cellspacing="0" style="width:100%;text-align:center;margin-bottom:12px;">
        <tr>
          <td style="background:#F5F7FA;border-radius:4px;border:1px solid #E1E6EE;"><strong style="font-size:8px;color:#94A3B8;">TOTAL SUBJECTS</strong><br/><br/>___</td>
          <td style="background:#F5F7FA;border-radius:4px;border:1px solid #E1E6EE;"><strong style="font-size:8px;color:#94A3B8;">PENDING TASKS</strong><br/><br/>___</td>
          <td style="background:#F5F7FA;border-radius:4px;border:1px solid #E1E6EE;"><strong style="font-size:8px;color:#94A3B8;">COMPLETED</strong><br/><br/>___</td>
        </tr>
      </table>
      <h3 style="color:${accent};font-size:11px;letter-spacing:2px;">ASSIGNMENT LIST</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="width:100%;border-collapse:collapse;border-color:#E1E6EE;font-size:9px;">
        <tr style="background:#1A242B;color:white;"><td>SUBJECT / COURSE</td><td>ASSIGNMENT DESCRIPTION</td><td style="width:70px;">DUE DATE</td><td style="width:50px;">STATUS</td><td style="width:50px;">GRADE</td></tr>
        ${Array.from({length:15},(_,i) => `<tr style="background:${i%2===0?'#F5F7FA':'white'}"><td style="height:25px;">&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>○ ○ ○</td><td>&nbsp;</td></tr>`).join('')}
      </table>
      <div style="font-size:8px;color:#94A3B8;margin-top:6px;">Status: ○ Not Started • ○ In Progress • ○ Completed</div>
      <h3 style="color:${accent};font-size:10px;letter-spacing:2px;margin-top:14px;">IMPORTANT REMINDERS</h3>
      <div style="border:1px solid #E1E6EE;border-radius:4px;padding:12px;min-height:60px;background:#F5F7FA;">&nbsp;</div>
    `;
  } else { // generic fallback
  }

  const doc_content = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>${planner.title}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
<style>@page{size:${paper.w}mm ${paper.h}mm;margin:15mm;}body{font-family:'Segoe UI',Arial,sans-serif;color:#1A242B;margin:0;padding:0;font-size:10px;}</style>
</head><body>
<div style="border-top:4px solid ${accent};padding-top:14px;">
<table width="100%"><tr>
<td><span style="font-size:12px;font-weight:bold;letter-spacing:2px;">TASKLET</span><br/><span style="font-size:7px;color:#94A3B8;letter-spacing:1px;">STUDY TEMPLATE</span></td>
<td style="text-align:right;font-size:8px;color:#BEC6D2;">Name: ________________________________<br/>Date: _____ / _____ / _____</td>
</tr></table>
<hr style="border:none;border-top:2px solid #1A242B;margin:8px 0 3px 0;"/><hr style="border:none;border-top:1px solid ${accent};margin:0 0 12px 0;"/>
<h1 style="font-size:20px;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:1px;">${planner.title}</h1>
<span style="display:inline-block;background:${accent};color:white;padding:2px 8px;border-radius:3px;font-size:7px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;">${planner.type}</span>
<p style="color:#94A3B8;font-size:9px;margin-bottom:16px;">${planner.description}</p>
${sections_html}
<hr style="border:none;border-top:1px solid #1A242B;margin:20px 0 6px 0;"/>
<table width="100%"><tr>
<td style="font-size:6px;font-weight:bold;color:#1A242B;">TASKLET Learnify</td>
<td style="font-size:6px;color:#BEC6D2;text-align:right;">© ${new Date().getFullYear()} TASKLET • ${paper.label}</td>
</tr></table>
</div></body></html>`;

  const blob = new Blob(['\ufeff' + doc_content], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${planner.title.toLowerCase().replace(/\s+/g, '-')}-${size_key.toLowerCase()}.doc`;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => { document.body.removeChild(link); URL.revokeObjectURL(url); }, 100);
};

// ═══════════════════════════════════════════════════════════════════
//  PUBLIC API: generate_lecture_pdf
// ═══════════════════════════════════════════════════════════════════
export const generate_lecture_pdf = (subject: any) => {
  const pw = 210, ph = 297, M = 20;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pw, ph] });

  // Header Cover
  doc.setFillColor(26, 36, 43); // Tasklet Deep
  doc.rect(0, 0, pw, 45, 'F');
  
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(subject.title.toUpperCase(), M, 25);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(148, 163, 184); // Tasklet Steel
  doc.text(`TASKLET Learnify OFFICIAL LECTURE / ${subject.level.toUpperCase()}`, M, 35);

  // Content Outline
  let y = 65;
  doc.setFontSize(16);
  doc.setTextColor(26, 36, 43);
  doc.setFont('helvetica', 'bold');
  doc.text('I. OVERVIEW', M, y);
  y += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(80, 90, 100);
  doc.setFont('helvetica', 'normal');
  const overview_text = `This comprehensive lecture covers the fundamental concepts of ${subject.title} for the ${subject.level} level. Understanding these principles is essential for academic success and practical application. Research thoroughly and cross-reference with practical examples in your learning module.`;
  const split_overview = doc.splitTextToSize(overview_text, pw - M*2);
  doc.text(split_overview, M, y);
  y += split_overview.length * 6 + 15;

  // Topics/Notes Rendering
  doc.setFontSize(16);
  doc.setTextColor(26, 36, 43);
  doc.setFont('helvetica', 'bold');
  doc.text('II. LECTURE MODULES & NOTES', M, y);
  y += 12;

  subject.topics.forEach((topic: string, i: number) => {
    // Check page break for section header
    if (y > ph - 40) {
      doc.addPage();
      y = 30;
    }
    
    // Topic Header Bar
    doc.setFillColor(245, 247, 250); // Cloud
    doc.roundedRect(M, y, pw - M*2, 10, 1.5, 1.5, 'F');
    doc.setFillColor(56, 141, 248); // Navy accent
    doc.rect(M, y, 3, 10, 'F'); // Left accent edge

    doc.setFontSize(11);
    doc.setTextColor(26, 36, 43);
    doc.setFont('helvetica', 'bold');
    doc.text(`Module ${i+1}: ${topic}`, M + 8, y + 6.5);
    y += 18;

    // Detailed Notes
    const noteContent = subject.notes && subject.notes[topic] 
        ? subject.notes[topic]
        : `Detailed comprehensive academic study material for ${topic}. This section explores key theories, definitions, structural frameworks, and application methodologies necessary to master the curriculum. By examining the context and operational mechanisms of this topic, students will develop a critical understanding crucial for examinations and advanced study.\n\n• Remember to review all foundational axioms related to this module.\n• Practice with real-world hypothetical models.\n• Summarize your learnings after completing this section.`;
        
    doc.setFontSize(10);
    doc.setTextColor(80, 90, 100);
    doc.setFont('helvetica', 'normal');
    
    const paragraphs = noteContent.split('\n');
    paragraphs.forEach((para: string) => {
        const lines = doc.splitTextToSize(para, pw - M*2);
        if (y + lines.length * 5 > ph - 25) {
            doc.addPage();
            y = 30;
        }
        if (para.trim().length > 0) {
            doc.text(lines, M, y);
            y += lines.length * 5.5 + 4;
        } else {
            y += 4; // paragraph spacing
        }
    });
    
    y += 8; // spacing between topics
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(6);
    doc.setTextColor(190, 198, 210);
    doc.text(`TASKLET ACADEMIC ESSENTIAL • PAGE ${i} OF ${pageCount}`, pw / 2, ph - 10, { align: 'center' });
  }

  doc.save(`Tasklet-Lecture-${subject.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};
