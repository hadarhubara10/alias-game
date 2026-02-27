import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { useGameStore } from '../store/gameStore';
import type { Card } from '../store/types';
import { Button, Modal, Badge } from '../components/ui';
import { ROUTES } from '../consts';

const EXCEL_HEADER = 'מילה';

type ImportMode = 'replace' | 'append';

function downloadExcelTemplate() {
  const wb = XLSX.utils.book_new();
  const wsData = [[EXCEL_HEADER], ['מרדכי'], ['אסתר'], ['אוזני המן']];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  ws['!cols'] = [{ wch: 30 }];

  XLSX.utils.book_append_sheet(wb, ws, 'קלפים');
  XLSX.writeFile(wb, 'alias-template.xlsx');
}

function exportCardsToExcel(cards: Card[]) {
  const wb = XLSX.utils.book_new();
  const wsData = [[EXCEL_HEADER], ...cards.map((c) => [c.word])];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  ws['!cols'] = [{ wch: 30 }];

  XLSX.utils.book_append_sheet(wb, ws, 'קלפים');
  XLSX.writeFile(wb, 'alias-cards.xlsx');
}

function parseExcelFile(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 }) as unknown[][];

        const words = rows
          .slice(1)
          .map((row) => String(row[0] ?? '').trim())
          .filter(Boolean);

        resolve(words);
      } catch {
        reject(new Error('שגיאה בקריאת הקובץ'));
      }
    };
    reader.onerror = () => reject(new Error('שגיאה בקריאת הקובץ'));
    reader.readAsArrayBuffer(file);
  });
}

export function AdminPanelPage() {
  const navigate = useNavigate();
  const { cards, usedCardIds, addCard, updateCard, deleteCard, importCards } =
    useGameStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [formWord, setFormWord] = useState('');

  const [pendingImportWords, setPendingImportWords] = useState<string[]>([]);
  const [isImportModeModalOpen, setIsImportModeModalOpen] = useState(false);
  const [importError, setImportError] = useState('');

  const usedSet = useMemo(() => new Set(usedCardIds), [usedCardIds]);

  const filteredCards = useMemo(
    () =>
      cards.filter((card) =>
        card.word.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [cards, searchTerm]
  );

  const handleOpenAdd = () => {
    setEditingCard(null);
    setFormWord('');
    setIsCardModalOpen(true);
  };

  const handleOpenEdit = (card: Card) => {
    setEditingCard(card);
    setFormWord(card.word);
    setIsCardModalOpen(true);
  };

  const handleSaveCard = () => {
    if (!formWord.trim()) return;
    if (editingCard) {
      updateCard(editingCard.id, { word: formWord.trim() });
    } else {
      addCard({ word: formWord.trim() });
    }
    setIsCardModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('האם למחוק את הקלף?')) {
      deleteCard(id);
    }
  };

  const handleExport = () => {
    exportCardsToExcel(cards);
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';

    setImportError('');
    try {
      const words = await parseExcelFile(file);
      if (words.length === 0) {
        setImportError('לא נמצאו מילים בקובץ. ודא שהעמודה הראשונה נקראת "מילה".');
        return;
      }
      setPendingImportWords(words);
      setIsImportModeModalOpen(true);
    } catch {
      setImportError('שגיאה בקריאת הקובץ. ודא שהקובץ בפורמט Excel תקין.');
    }
  };

  const handleConfirmImport = (mode: ImportMode) => {
    const newCards: Card[] = pendingImportWords.map((word) => ({
      id: crypto.randomUUID(),
      word,
    }));
    importCards(newCards, mode);
    setPendingImportWords([]);
    setIsImportModeModalOpen(false);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">ניהול קלפים</h1>
          <Button variant="secondary" size="sm" onClick={() => navigate(ROUTES.HOME)}>
            חזרה
          </Button>
        </div>

        {importError && (
          <div className="bg-rose-900/50 border border-rose-500 rounded-xl p-3 mb-4 text-rose-300">
            {importError}
          </div>
        )}

        <div className="bg-slate-800/60 backdrop-blur rounded-2xl p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="md" onClick={handleOpenAdd}>
                + הוסף קלף
              </Button>
              <Button variant="secondary" size="md" onClick={handleExport}>
                ייצוא Excel
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => fileInputRef.current?.click()}
              >
                ייבוא Excel
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={downloadExcelTemplate}
                className="text-amber-300 border border-amber-600"
              >
                הורד תבנית
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportFile}
                className="hidden"
              />
            </div>
            <div className="text-slate-400 text-sm">
              סה״כ: <span className="text-white font-bold">{cards.length}</span> | שומשו:{' '}
              <span className="text-white font-bold">{usedCardIds.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur rounded-2xl p-4 mb-4">
          <input
            type="text"
            placeholder="חיפוש מילה..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-text"
          />
        </div>

        <div className="bg-slate-800/60 backdrop-blur rounded-2xl overflow-hidden">
          <div className="max-h-[60vh] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-slate-700 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-right text-slate-300 font-medium">מילה</th>
                  <th className="px-4 py-3 text-right text-slate-300 font-medium w-24">סטטוס</th>
                  <th className="px-4 py-3 text-right text-slate-300 font-medium w-32">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredCards.map((card) => (
                  <tr
                    key={card.id}
                    className={`hover:bg-slate-700/50 transition-colors ${
                      usedSet.has(card.id) ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-white font-medium">{card.word}</td>
                    <td className="px-4 py-3">
                      {usedSet.has(card.id) ? (
                        <Badge variant="default" size="sm">שומש</Badge>
                      ) : (
                        <Badge variant="success" size="sm">זמין</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleOpenEdit(card)}
                          className="text-purple-400 hover:text-purple-300 cursor-pointer transition-colors"
                        >
                          עריכה
                        </button>
                        <button
                          onClick={() => handleDelete(card.id)}
                          className="text-rose-400 hover:text-rose-300 cursor-pointer transition-colors"
                        >
                          מחיקה
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCards.length === 0 && (
              <div className="p-8 text-center text-slate-400">לא נמצאו קלפים</div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit card modal */}
      <Modal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        title={editingCard ? 'עריכת קלף' : 'הוספת קלף'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2">מילה</label>
            <input
              type="text"
              value={formWord}
              onChange={(e) => setFormWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveCard()}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-text"
              placeholder="הכנס מילה..."
              autoFocus
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" size="md" onClick={() => setIsCardModalOpen(false)}>
              ביטול
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleSaveCard}
              disabled={!formWord.trim()}
            >
              {editingCard ? 'שמור' : 'הוסף'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Import mode selection modal */}
      <Modal
        isOpen={isImportModeModalOpen}
        onClose={() => setIsImportModeModalOpen(false)}
        title="ייבוא קלפים"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            נמצאו <span className="text-white font-bold">{pendingImportWords.length}</span> מילים.
            <br />
            כיצד לייבא אותם?
          </p>

          <div className="space-y-3">
            <button
              onClick={() => handleConfirmImport('replace')}
              className="w-full p-4 rounded-xl bg-rose-600/30 border-2 border-rose-500 text-right cursor-pointer hover:bg-rose-600/50 transition-colors"
            >
              <div className="text-white font-bold mb-1">החלף קלפים קיימים</div>
              <div className="text-rose-300 text-sm">
                מחק את כל {cards.length} הקלפים הקיימים והחלף בקלפים החדשים
              </div>
            </button>

            <button
              onClick={() => handleConfirmImport('append')}
              className="w-full p-4 rounded-xl bg-emerald-600/30 border-2 border-emerald-500 text-right cursor-pointer hover:bg-emerald-600/50 transition-colors"
            >
              <div className="text-white font-bold mb-1">הוסף לקלפים קיימים</div>
              <div className="text-emerald-300 text-sm">
                שמור את {cards.length} הקלפים הקיימים והוסף עוד {pendingImportWords.length}
              </div>
            </button>
          </div>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => setIsImportModeModalOpen(false)}
          >
            ביטול
          </Button>
        </div>
      </Modal>
    </div>
  );
}
