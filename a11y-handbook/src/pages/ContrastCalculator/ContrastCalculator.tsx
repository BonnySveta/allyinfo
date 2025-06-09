import React, { useState } from 'react';
import styled from 'styled-components';
import { TitleSection } from '../../components/TitleSection/TitleSection';
import { Banner } from '../../components/Banner/Banner';

const Container = styled.div`
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const MainContent = styled.div`
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const LeftCol = styled.div`
  flex: 2 1 0;
  max-width: 600px;
  min-width: 0;
`;

const RightCol = styled.div`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputsRow = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ColorInputLabel = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  color: var(--text-color);
`;

const ColorInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: center;
`;

const Preview = styled.div<{ fg: string; bg: string; fontSize: number; bold: boolean }>`
  margin: 2rem 0 0 0;
  padding: 2rem;
  border-radius: 8px;
  background: ${({ bg }) => bg};
  color: ${({ fg }) => fg};
  font-size: ${({ fontSize }) => fontSize}px;
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
  text-align: center;
  border: 1px solid #eee;
`;

const ResultCard = styled.div`
  background: var(--card-background, #fff);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #ececec;
  padding: 1.5rem 2rem;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1.1rem;
  color: var(--text-color);
`;

const Result = styled.div`
  font-size: 1.2rem;
  margin-top: 1rem;
`;

const ResultsRow = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: stretch;
  margin-top: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

// Функция для перевода hex в RGB
function hexToRgb(hex: string) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
  const num = parseInt(c, 16);
  return [
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255
  ];
}

// Функция для расчёта относительной яркости
function luminance([r, g, b]: number[]) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

// Функция для расчёта контрастного соотношения
function contrastRatio(fg: string, bg: string) {
  const lum1 = luminance(hexToRgb(fg));
  const lum2 = luminance(hexToRgb(bg));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function isLargeText(fontSize: number, bold: boolean) {
  // WCAG: large text = 18pt (24px) normal, 14pt (18.66px) bold
  // Обычно используют px, 1pt = 1.333px
  // 18pt = 24px, 14pt = 18.66px
  if (bold) {
    return fontSize >= 18.66;
  } else {
    return fontSize >= 24;
  }
}

function getWcagStatuses(ratio: number, isLarge: boolean) {
  // Возвращает статусы для AA и AAA
  const aa = isLarge ? ratio >= 3 : ratio >= 4.5;
  const aaa = isLarge ? ratio >= 4.5 : ratio >= 7;
  return {
    aa: aa ? '✅ AA' : '❌ AA',
    aaa: aaa ? '✅ AAA' : '❌ AAA',
    aaThreshold: isLarge ? 3 : 4.5,
    aaaThreshold: isLarge ? 4.5 : 7,
    label: isLarge ? 'Крупный текст' : 'Обычный текст',
  };
}

// --- APCA точная реализация (SAPC-7) ---
// Источник: https://github.com/Myndex/SAPC-APCA/blob/master/README.md
function APCAcontrast(txtHex: string, bgHex: string) {
  // Преобразование HEX в sRGB
  function hexToSRGB(hex: string) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
    const num = parseInt(c, 16);
    return [
      (num >> 16) & 255,
      (num >> 8) & 255,
      num & 255
    ];
  }

  // Линейное преобразование sRGB
  function toLinear(c: number) {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  // Перцептивные коэффициенты (SAPC-7)
  function calcY([r, g, b]: number[]) {
    return 0.2126729 * toLinear(r) + 0.7151522 * toLinear(g) + 0.0721750 * toLinear(b);
  }

  // SAPC-7 параметры
  const normBG = calcY(hexToSRGB(bgHex));
  const normTXT = calcY(hexToSRGB(txtHex));
  const BK = normBG;
  const TK = normTXT;
  const output = (() => {
    // Порог чувствительности
    if (Math.abs(BK - TK) < 0.0005) return 0;
    // Светлый текст на тёмном фоне
    if (BK > TK) {
      const SAPC = (Math.pow(BK, 0.56) - Math.pow(TK, 0.57)) * 1.14;
      return SAPC > 0.1 ? SAPC * 100 : 0;
    }
    // Тёмный текст на светлом фоне
    else {
      const SAPC = (Math.pow(BK, 0.65) - Math.pow(TK, 0.62)) * 1.14;
      return SAPC < -0.1 ? SAPC * 100 : 0;
    }
  })();
  return output;
}

function getApcaStatus(Lc: number, isLarge: boolean) {
  // Рекомендации APCA: обычный текст |Lc| >= 60, крупный >= 45, второстепенный >= 30
  const absLc = Math.abs(Lc);
  let status = '';
  let threshold = 0;
  if (isLarge) {
    threshold = 45;
    status = absLc >= 45 ? '✅ Проходит (крупный текст)' : '❌ Не проходит (крупный текст)';
  } else {
    threshold = 60;
    status = absLc >= 60 ? '✅ Проходит (обычный текст)' : '❌ Не проходит (обычный текст)';
  }
  return { status, threshold, label: isLarge ? 'Крупный текст' : 'Обычный текст' };
}

export default function ContrastCalculator() {
  const [fg, setFg] = useState('#222222');
  const [bg, setBg] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(16);
  const [bold, setBold] = useState(false);
  const ratio = contrastRatio(fg, bg);
  const large = isLargeText(fontSize, bold);
  const wcag = getWcagStatuses(ratio, large);

  // APCA
  const apcaLc = APCAcontrast(fg, bg);
  const apca = getApcaStatus(apcaLc, large);

  return (
    <Container>
      <TitleSection
        title="Калькулятор контрастности"
        subtitle="Проверьте контрастность ваших цветов по стандарту WCAG и APCA"
        // banner={
        //   <Banner
        //     title="WCAG 2.1"
        //     text={null}
        //     link="/wcag"
        //     linkLabel="Узнайте больше о требованиях к контрастности в WCAG 2.1"
        //     emoji="📚"
        //   />
        // }
      />
      <MainContent>
        <LeftCol>
          <InputsRow>
            <ColorInputLabel>
              Цвет текста
              <ColorInputRow>
                <input type="color" value={fg} onChange={e => setFg(e.target.value)} />
                <input
                  type="text"
                  value={fg}
                  onChange={e => {
                    const val = e.target.value;
                    if (/^#([0-9a-fA-F]{0,6})$/.test(val)) setFg(val);
                  }}
                  maxLength={7}
                  style={{ width: 80, fontFamily: 'monospace', fontSize: '1rem' }}
                />
              </ColorInputRow>
            </ColorInputLabel>
            <ColorInputLabel>
              Цвет фона
              <ColorInputRow>
                <input type="color" value={bg} onChange={e => setBg(e.target.value)} />
                <input
                  type="text"
                  value={bg}
                  onChange={e => {
                    const val = e.target.value;
                    if (/^#([0-9a-fA-F]{0,6})$/.test(val)) setBg(val);
                  }}
                  maxLength={7}
                  style={{ width: 80, fontFamily: 'monospace', fontSize: '1rem' }}
                />
              </ColorInputRow>
            </ColorInputLabel>
          </InputsRow>
          <ControlsRow>
            <label>
              Размер текста
              <input
                type="number"
                min={10}
                max={72}
                value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                style={{ width: 60, marginLeft: 8 }}
              /> px
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input
                type="checkbox"
                checked={bold}
                onChange={e => setBold(e.target.checked)}
                style={{ marginRight: 4 }}
              />
              Жирный
            </label>
          </ControlsRow>
          <div style={{ fontWeight: bold ? 'bold' : 'normal', fontSize: 16, marginBottom: 8 }}>
            Категория: {wcag.label}
          </div>
          <Preview fg={fg} bg={bg} fontSize={fontSize} bold={bold}>
            Accessibility matters!
          </Preview>
        </LeftCol>
        <RightCol>
          <ResultCard>
            <b>WCAG 2.x:</b><br />
            Контрастное соотношение: {ratio.toFixed(2)}:1<br />
            <div style={{margin: '0.5rem 0'}}>
              <span style={{marginRight: 12}}>{wcag.aa} (порог: {wcag.aaThreshold}:1)</span>
              <span>{wcag.aaa} (порог: {wcag.aaaThreshold}:1)</span>
            </div>
          </ResultCard>
          <ResultCard>
            <b>APCA:</b><br />
            Контрастный индекс: {apcaLc.toFixed(0)} Lc<br />
            {apca.status.replace(/\s*\(.*\)/, '')} (порог: {apca.threshold} Lc)
          </ResultCard>
        </RightCol>
      </MainContent>
    </Container>
  );
} 