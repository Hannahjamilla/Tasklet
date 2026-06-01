import { createElement, useState } from 'react';

/**
 * VaultScratchpad — Inline toolbar buttons for highlighting lecture text.
 * Sits inside the top toolbar bar alongside navigation buttons.
 */
export const VaultScratchpad = () => {
    const [feedback, setFeedback] = useState('');
    const [confirmErase, setConfirmErase] = useState(false);

    const highlightSelection = () => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.rangeCount) {
            setFeedback('Select text first');
            setTimeout(() => setFeedback(''), 2000);
            return;
        }
        const range = sel.getRangeAt(0);
        const mark = document.createElement('mark');
        mark.style.backgroundColor = '#FDE047';
        mark.style.borderRadius = '2px';
        mark.style.padding = '0 1px';
        range.surroundContents(mark);
        sel.removeAllRanges();
        setFeedback('Done');
        setTimeout(() => setFeedback(''), 1500);
    };

    const undoHighlight = () => {
        const marks = document.querySelectorAll('mark');
        if (marks.length === 0) {
            setFeedback('Nothing to undo');
            setTimeout(() => setFeedback(''), 1500);
            return;
        }
        const last = marks[marks.length - 1];
        const parent = last.parentNode;
        if (parent) {
            while (last.firstChild) parent.insertBefore(last.firstChild, last);
            parent.removeChild(last);
        }
        setFeedback('Undone');
        setTimeout(() => setFeedback(''), 1500);
    };

    const eraseAll = () => {
        const marks = document.querySelectorAll('mark');
        marks.forEach(m => {
            const parent = m.parentNode;
            if (parent) {
                while (m.firstChild) parent.insertBefore(m.firstChild, m);
                parent.removeChild(m);
            }
        });
        setConfirmErase(false);
        setFeedback('Cleared');
        setTimeout(() => setFeedback(''), 1500);
    };

    return createElement('div', { className: 'flex gap-1.5 items-center' },
        createElement('button', {
            onClick: highlightSelection,
            className: 'px-2.5 py-1 bg-[#FEF08A] hover:bg-[#FDE047] text-[#854D0E] font-bold text-[11px] rounded transition-colors'
        }, 'Highlight'),

        createElement('button', {
            onClick: undoHighlight,
            className: 'px-2.5 py-1 bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#475569] font-bold text-[11px] rounded transition-colors'
        }, 'Undo'),

        !confirmErase
            ? createElement('button', {
                onClick: () => setConfirmErase(true),
                className: 'px-2.5 py-1 bg-white border border-[#CBD5E1] hover:bg-[#FEE2E2] hover:border-[#FCA5A5] hover:text-[#DC2626] text-[#475569] font-bold text-[11px] rounded transition-colors'
            }, 'Erase')
            : createElement('div', { className: 'flex gap-1 items-center' },
                createElement('span', { className: 'text-[10px] font-bold text-[#DC2626]' }, 'Sure?'),
                createElement('button', {
                    onClick: eraseAll,
                    className: 'px-2 py-1 bg-[#DC2626] text-white font-bold text-[10px] rounded'
                }, 'Yes'),
                createElement('button', {
                    onClick: () => setConfirmErase(false),
                    className: 'px-2 py-1 bg-[#F1F5F9] text-[#475569] font-bold text-[10px] rounded'
                }, 'No')
            ),

        feedback && createElement('span', { className: 'text-[10px] font-bold text-[#3B82F6] animate-pulse' }, feedback)
    );
};
