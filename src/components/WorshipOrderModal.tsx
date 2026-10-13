import React from 'react';
import { X, Calendar, Church, ArrowRight, BookOpen, Music, Heart } from 'lucide-react';
import { ThemeMode } from '../types/hymn';

interface WorshipOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHymnId: (id: number) => void;
  theme: ThemeMode;
}

export const WorshipOrderModal: React.FC<WorshipOrderModalProps> = ({
  isOpen,
  onClose,
  onSelectHymnId,
  theme
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';

  const modalBg = isDark
    ? 'bg-slate-900 border-slate-700 text-slate-100'
    : isSepia
    ? 'bg-[#fcf7ee] border-[#d4be9b] text-[#3d2f1d]'
    : 'bg-white border-amber-200 text-slate-900';

  const itemBg = isDark
    ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
    : isSepia
    ? 'bg-[#f5ede0] hover:bg-[#ede1ce] border-[#d8c8b2]'
    : 'bg-amber-50/60 hover:bg-amber-100/60 border-amber-200';

  const worshipItems = [
    {
      step: '1. Sabbath School & Song Service',
      desc: 'Opening songs of praise and thanksgiving to welcome the Sabbath day',
      recommendedHymns: [
        { id: 415, title: 'Sweet Sabbath School' },
        { id: 193, title: 'Sabbath School (Juba Arabic)' },
        { id: 369, title: "Don't Forget the Sabbath" },
        { id: 478, title: 'Safely Through Another Week' }
      ]
    },
    {
      step: '2. Call to Worship & Reverence',
      desc: 'Inviting the Holy Spirit into the sanctuary and congregational reverence',
      recommendedHymns: [
        { id: 549, title: 'The Lord is in His Holy Temple' },
        { id: 437, title: 'Tread Softly (The Master is Here)' },
        { id: 552, title: 'Sweet, Sweet Spirit' }
      ]
    },
    {
      step: '3. Opening Hymn of Praise',
      desc: 'Congregational hymn uniting voices in adoration of the Creator God',
      recommendedHymns: [
        { id: 1, title: 'Nina Wodi Le Rabuna (Juba Arabic)' },
        { id: 499, title: 'Holy, Holy, Holy! Lord God Almighty' },
        { id: 467, title: 'To God Be the Glory' },
        { id: 363, title: 'Marching to Zion' },
        { id: 389, title: 'Great is Thy Faithfulness' }
      ]
    },
    {
      step: '4. Intercessory & Pastoral Prayer',
      desc: 'Reverent kneeling in communion with our Heavenly Father',
      recommendedHymns: [
        { id: 472, title: 'I Need Thee Every Hour' },
        { id: 412, title: 'Whisper a Prayer' },
        { id: 547, title: 'Hear Our Prayer, O Lord' },
        { id: 194, title: 'Saa ta Salaa (Juba Arabic)' }
      ]
    },
    {
      step: '5. Tithes & Offerings (Bakshish)',
      desc: 'Giving our faithful tithes and gifts to support the gospel work in South Sudan and worldwide',
      recommendedHymns: [
        { id: 518, title: 'We Give Thee But Thine Own' },
        { id: 48, title: 'Yakwana Nina Wodi Le Allah' },
        { id: 147, title: 'Rabuna Alela Hibu Nina' }
      ]
    },
    {
      step: '6. Children & Youth Feature',
      desc: 'Adventist Youth (AYS) and children singing for Christ',
      recommendedHymns: [
        { id: 502, title: 'Jesus Loves Me! This I Know' },
        { id: 324, title: 'Nina Kulana Iyal Sukerin' },
        { id: 72, title: 'Shabaabu Bi Guna (Youth Chorus)' },
        { id: 523, title: "We Are Christ's Ambassadors" }
      ]
    },
    {
      step: '7. Closing Hymn of Consecration',
      desc: 'Dedication of our hearts to Christ and the Blessed Hope of His Second Coming',
      recommendedHymns: [
        { id: 414, title: 'We Have This Hope (Official SDA Theme)' },
        { id: 362, title: 'I Have Decided to Follow Jesus' },
        { id: 396, title: 'I Surrender All' },
        { id: 510, title: 'It Is Well With My Soul' },
        { id: 19, title: 'Inta Wogif Gowi (Juba Arabic)' }
      ]
    },
    {
      step: '8. Doxology & Benediction',
      desc: 'Congregational blessing and dismissal in peace',
      recommendedHymns: [
        { id: 546, title: 'Praise God from Whom All Blessings Flow (Doxology)' },
        { id: 548, title: 'Dismiss Us Lord, With Blessing' },
        { id: 486, title: 'God Be With You Till We Meet Again' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-3xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${modalBg}`}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-amber-800 dark:text-amber-400">
                Sabbath Order of Worship
              </h2>
              <p className="text-xs opacity-75">
                Maga Maga C SDA Church • Sabbath Service Liturgy & Hymn Concordance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center gap-3">
            <Church className="w-5 h-5 text-amber-600 shrink-0" />
            <p>
              <strong>Happy Sabbath!</strong> Click on any suggested hymn below to load it instantly with lyrics and
              audio accompaniment for your church service.
            </p>
          </div>

          <div className="space-y-3">
            {worshipItems.map((item, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border transition-all ${itemBg}`}>
                <h3 className="font-semibold text-sm text-amber-800 dark:text-amber-400">
                  {item.step}
                </h3>
                <p className="text-xs opacity-75 mt-0.5 mb-2.5">{item.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {item.recommendedHymns.map(h => (
                    <button
                      key={h.id}
                      onClick={() => {
                        onSelectHymnId(h.id);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 hover:border-amber-500 text-xs font-medium hover:text-amber-600 transition-colors shadow-2xs group"
                    >
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        #{h.id}
                      </span>
                      <span className="truncate max-w-[200px]">{h.title}</span>
                      <ArrowRight className="w-3 h-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-black/10 dark:border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
