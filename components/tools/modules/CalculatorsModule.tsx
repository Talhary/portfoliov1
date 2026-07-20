'use client';

import { useState } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { FiSliders, FiDollarSign, FiActivity, FiClock, FiZap, FiPlus, FiTrash2, FiAward } from 'react-icons/fi';

// Custom interactive Number Input component with +/- stepper buttons
const NumberInput = ({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
}: {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  step?: number;
  min?: number;
}) => {
  const numVal = parseFloat(value) || 0;

  const handleDecrement = () => {
    const next = Math.max(min, numVal - step);
    onChange(String(Number(next.toFixed(2))));
  };

  const handleIncrement = () => {
    const next = numVal + step;
    onChange(String(Number(next.toFixed(2))));
  };

  return (
    <div>
      {label && <label className="block text-xs font-bold uppercase text-stone-500 mb-1.5">{label}</label>}
      <div className="relative flex items-center rounded-xl overflow-hidden border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950 focus-within:ring-2 focus-within:ring-primary/40 transition-all shadow-2xs">
        <button
          type="button"
          onClick={handleDecrement}
          className="px-3.5 py-3 bg-stone-200/80 dark:bg-zinc-800/80 hover:bg-primary hover:text-white text-stone-700 dark:text-zinc-300 font-black text-sm transition-all active:scale-95 select-none cursor-pointer"
          title="Decrease value"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full py-3 px-2 text-center bg-transparent font-mono font-bold text-sm text-stone-900 dark:text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={handleIncrement}
          className="px-3.5 py-3 bg-stone-200/80 dark:bg-zinc-800/80 hover:bg-primary hover:text-white text-stone-700 dark:text-zinc-300 font-black text-sm transition-all active:scale-95 select-none cursor-pointer"
          title="Increase value"
        >
          +
        </button>
      </div>
    </div>
  );
};

export const CalculatorsModule = ({ tool }: { tool: ToolDefinition }) => {
  // Common calculator states
  const [valA, setValA] = useState<string>('100');
  const [valB, setValB] = useState<string>('10');
  const [valC, setValC] = useState<string>('5');
  const [unitMode, setUnitMode] = useState<'metric' | 'imperial'>('metric');
  const [calcDisplay, setCalcDisplay] = useState<string>('0');

  // GPA Calculator state
  const [gpaCourses, setGpaCourses] = useState<{ name: string; grade: number; credits: number }[]>([
    { name: 'Computer Science 101', grade: 4.0, credits: 3 },
    { name: 'Calculus I', grade: 3.7, credits: 4 },
    { name: 'Physics & Lab', grade: 3.3, credits: 4 },
  ]);

  // Date of birth state
  const [dob, setDob] = useState<string>('2000-01-15');

  // Currency converter state
  const [fromCurr, setFromCurr] = useState<string>('USD');
  const [toCurr, setToCurr] = useState<string>('EUR');
  const [currAmount, setCurrAmount] = useState<string>('100');

  // Keypad click handler for Basic Calculator
  const handleKeypad = (char: string) => {
    if (char === 'C') {
      setCalcDisplay('0');
    } else if (char === '=') {
      try {
        const sanitized = calcDisplay.replace(/×/g, '*').replace(/÷/g, '/');
        const res = Function(`"use strict"; return (${sanitized})`)();
        setCalcDisplay(String(res));
      } catch {
        setCalcDisplay('Error');
      }
    } else {
      if (calcDisplay === '0' || calcDisplay === 'Error') {
        setCalcDisplay(char);
      } else {
        setCalcDisplay(calcDisplay + char);
      }
    }
  };

  const renderCalculatorContent = () => {
    switch (tool.id) {
      case 'basic-calc':
        return (
          <div className="max-w-xs mx-auto bg-stone-900 text-white p-5 rounded-3xl shadow-2xl border border-zinc-800">
            <div className="bg-black/60 p-4 rounded-2xl mb-4 text-right text-3xl font-mono overflow-x-auto">
              {calcDisplay}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['C', '÷', '×', '⌫', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.'].map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === '⌫') {
                      setCalcDisplay(calcDisplay.length > 1 ? calcDisplay.slice(0, -1) : '0');
                    } else {
                      handleKeypad(key);
                    }
                  }}
                  className={`p-3 text-lg font-bold rounded-xl transition-all ${
                    key === '='
                      ? 'col-span-2 bg-primary text-white hover:bg-primary/90'
                      : ['+', '-', '×', '÷', 'C', '⌫'].includes(key)
                      ? 'bg-zinc-800 text-primary hover:bg-zinc-700'
                      : 'bg-zinc-800/60 text-white hover:bg-zinc-700'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        );

      case 'percentage-calc': {
        const num = parseFloat(valA) || 0;
        const pct = parseFloat(valB) || 0;
        const result = (num * pct) / 100;
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberInput
                label="Percentage Rate (%)"
                value={valB}
                onChange={setValB}
                step={5}
              />
              <NumberInput
                label="Total Base Amount"
                value={valA}
                onChange={setValA}
                step={10}
              />
            </div>
            <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl text-center shadow-inner">
              <span className="text-xs uppercase font-bold text-primary tracking-wider">Calculated Value ({valB}% of {valA})</span>
              <div className="text-4xl font-black text-primary mt-1">{result.toFixed(2)}</div>
            </div>
          </div>
        );
      }

      case 'bmi-calc': {
        const weight = parseFloat(valA) || 70;
        const height = parseFloat(valB) || 175;
        let bmi = 0;

        if (unitMode === 'metric') {
          const hMeters = height / 100;
          bmi = hMeters > 0 ? weight / (hMeters * hMeters) : 0;
        } else {
          bmi = height > 0 ? (weight / (height * height)) * 703 : 0;
        }

        const category =
          bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal Weight' : bmi < 30 ? 'Overweight' : 'Obese';

        return (
          <div className="space-y-6">
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setUnitMode('metric')}
                className={`px-4 py-2 text-xs font-bold rounded-xl uppercase transition-all ${
                  unitMode === 'metric' ? 'bg-primary text-white shadow-md' : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400'
                }`}
              >
                Metric (kg / cm)
              </button>
              <button
                onClick={() => setUnitMode('imperial')}
                className={`px-4 py-2 text-xs font-bold rounded-xl uppercase transition-all ${
                  unitMode === 'imperial' ? 'bg-primary text-white shadow-md' : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400'
                }`}
              >
                Imperial (lbs / in)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberInput
                label={`Weight (${unitMode === 'metric' ? 'kg' : 'lbs'})`}
                value={valA}
                onChange={setValA}
                step={1}
              />
              <NumberInput
                label={`Height (${unitMode === 'metric' ? 'cm' : 'inches'})`}
                value={valB}
                onChange={setValB}
                step={1}
              />
            </div>

            <div className="p-6 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center shadow-inner">
              <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">Your Body Mass Index</span>
              <div className="text-4xl font-black text-stone-900 dark:text-white mt-1">{bmi.toFixed(1)}</div>
              <span className="inline-block mt-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase rounded-full">
                {category}
              </span>
            </div>
          </div>
        );
      }

      case 'loan-calc': {
        const principal = parseFloat(valA) || 10000;
        const ratePct = parseFloat(valB) || 5;
        const years = parseFloat(valC) || 3;

        const monthlyRate = ratePct / 100 / 12;
        const numPayments = years * 12;

        const monthlyPayment =
          monthlyRate > 0
            ? (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
              (Math.pow(1 + monthlyRate, numPayments) - 1)
            : principal / numPayments;

        const totalPayable = monthlyPayment * numPayments;
        const totalInterest = totalPayable - principal;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <NumberInput
                label="Loan Principal ($)"
                value={valA}
                onChange={setValA}
                step={1000}
              />
              <NumberInput
                label="Annual Interest (%)"
                value={valB}
                onChange={setValB}
                step={0.5}
              />
              <NumberInput
                label="Term (Years)"
                value={valC}
                onChange={setValC}
                step={1}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-center shadow-inner">
                <div className="text-xs uppercase font-bold text-primary">Monthly Pay</div>
                <div className="text-2xl font-black text-primary mt-1">${monthlyPayment.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center shadow-inner">
                <div className="text-xs uppercase font-bold text-stone-500">Total Interest</div>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">${totalInterest.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center shadow-inner">
                <div className="text-xs uppercase font-bold text-stone-500">Total Payable</div>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">${totalPayable.toFixed(2)}</div>
              </div>
            </div>
          </div>
        );
      }

      case 'gpa-calc': {
        const totalPoints = gpaCourses.reduce((sum, c) => sum + c.grade * c.credits, 0);
        const totalCredits = gpaCourses.reduce((sum, c) => sum + c.credits, 0);
        const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-stone-500">Course List</span>
                <button
                  onClick={() => setGpaCourses([...gpaCourses, { name: `Course ${gpaCourses.length + 1}`, grade: 4.0, credits: 3 }])}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <FiPlus size={14} /> Add Course
                </button>
              </div>

              {gpaCourses.map((c, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center bg-stone-50 dark:bg-zinc-950 p-3 rounded-2xl border border-stone-200 dark:border-zinc-800">
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => {
                      const updated = [...gpaCourses];
                      updated[i].name = e.target.value;
                      setGpaCourses(updated);
                    }}
                    className="col-span-5 p-3 text-xs font-bold bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl outline-none"
                    placeholder="Course Title"
                  />
                  <select
                    value={c.grade}
                    onChange={(e) => {
                      const updated = [...gpaCourses];
                      updated[i].grade = parseFloat(e.target.value);
                      setGpaCourses(updated);
                    }}
                    className="col-span-3 p-3 text-xs font-bold bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl outline-none"
                  >
                    <option value={4.0}>A (4.0)</option>
                    <option value={3.7}>A- (3.7)</option>
                    <option value={3.3}>B+ (3.3)</option>
                    <option value={3.0}>B (3.0)</option>
                    <option value={2.7}>B- (2.7)</option>
                    <option value={2.3}>C+ (2.3)</option>
                    <option value={2.0}>C (2.0)</option>
                    <option value={1.0}>D (1.0)</option>
                    <option value={0.0}>F (0.0)</option>
                  </select>
                  <div className="col-span-3">
                    <NumberInput
                      value={String(c.credits)}
                      onChange={(val) => {
                        const updated = [...gpaCourses];
                        updated[i].credits = parseFloat(val) || 1;
                        setGpaCourses(updated);
                      }}
                      step={1}
                      min={1}
                    />
                  </div>
                  {gpaCourses.length > 1 && (
                    <button
                      onClick={() => setGpaCourses(gpaCourses.filter((_, idx) => idx !== i))}
                      className="col-span-1 p-2 text-stone-400 hover:text-red-500 transition-colors flex justify-center cursor-pointer"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl text-center">
              <div className="flex justify-center items-center gap-1.5 text-primary text-xs font-extrabold uppercase mb-1">
                <FiAward size={16} /> Cumulative Grade Point Average
              </div>
              <div className="text-5xl font-black text-primary">{gpa.toFixed(2)} / 4.00</div>
              <div className="text-xs text-stone-500 dark:text-zinc-400 mt-2 font-bold">
                Total Credits: {totalCredits} | Grade Points: {totalPoints.toFixed(1)}
              </div>
            </div>
          </div>
        );
      }

      case 'age-calc': {
        const birthDate = new Date(dob);
        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
          months -= 1;
          days += 30;
        }
        if (months < 0) {
          years -= 1;
          months += 12;
        }

        const totalDiffTime = Math.abs(today.getTime() - birthDate.getTime());
        const totalDays = Math.ceil(totalDiffTime / (1000 * 60 * 60 * 24));

        return (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Select Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-center">
                <div className="text-xs uppercase font-bold text-primary">Exact Age</div>
                <div className="text-2xl font-black text-primary mt-1">{years} Yrs {months} Mos</div>
              </div>
              <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center">
                <div className="text-xs uppercase font-bold text-stone-500">Days</div>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">{days} Days</div>
              </div>
              <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center">
                <div className="text-xs uppercase font-bold text-stone-500">Total Lifetime Days</div>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">{totalDays.toLocaleString()}</div>
              </div>
            </div>
          </div>
        );
      }

      case 'tip-calc': {
        const bill = parseFloat(valA) || 50;
        const tipPct = parseFloat(valB) || 15;
        const people = Math.max(1, parseInt(valC) || 1);

        const tipAmount = (bill * tipPct) / 100;
        const totalBill = bill + tipAmount;
        const perPerson = totalBill / people;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Bill Amount ($)</label>
                <input
                  type="number"
                  value={valA}
                  onChange={(e) => setValA(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Tip Percentage (%)</label>
                <input
                  type="number"
                  value={valB}
                  onChange={(e) => setValB(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Split Between (People)</label>
                <input
                  type="number"
                  value={valC}
                  onChange={(e) => setValC(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-center">
                <div className="text-xs uppercase font-bold text-primary">Pay Per Person</div>
                <div className="text-2xl font-black text-primary mt-1">${perPerson.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center">
                <div className="text-xs uppercase font-bold text-stone-500">Tip Amount</div>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">${tipAmount.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center">
                <div className="text-xs uppercase font-bold text-stone-500">Total Bill</div>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">${totalBill.toFixed(2)}</div>
              </div>
            </div>
          </div>
        );
      }

      case 'currency-converter': {
        const rates: Record<string, number> = {
          USD: 1.0,
          EUR: 0.92,
          GBP: 0.78,
          JPY: 155.4,
          CAD: 1.36,
          AUD: 1.51,
          INR: 83.2,
        };

        const amt = parseFloat(currAmount) || 100;
        const fromRate = rates[fromCurr] || 1.0;
        const toRate = rates[toCurr] || 1.0;
        const converted = (amt / fromRate) * toRate;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Amount</label>
                <input
                  type="number"
                  value={currAmount}
                  onChange={(e) => setCurrAmount(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">From Currency</label>
                <select
                  value={fromCurr}
                  onChange={(e) => setFromCurr(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-bold"
                >
                  {Object.keys(rates).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">To Currency</label>
                <select
                  value={toCurr}
                  onChange={(e) => setToCurr(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-bold"
                >
                  {Object.keys(rates).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl text-center">
              <div className="text-xs uppercase font-bold text-primary mb-1">Converted Value</div>
              <div className="text-4xl font-black text-primary">
                {converted.toFixed(2)} {toCurr}
              </div>
              <div className="text-xs text-stone-500 dark:text-zinc-400 mt-2 font-bold">
                Exchange Rate: 1 {fromCurr} = {((1 / fromRate) * toRate).toFixed(4)} {toCurr}
              </div>
            </div>
          </div>
        );
      }

      case 'discount-calc': {
        const price = parseFloat(valA) || 120;
        const discountPct = parseFloat(valB) || 20;

        const savings = (price * discountPct) / 100;
        const finalPrice = price - savings;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Original Item Price ($)</label>
                <input
                  type="number"
                  value={valA}
                  onChange={(e) => setValA(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Discount Rate (%)</label>
                <input
                  type="number"
                  value={valB}
                  onChange={(e) => setValB(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-primary/10 border border-primary/20 rounded-2xl text-center">
                <div className="text-xs uppercase font-bold text-primary">Final Discounted Price</div>
                <div className="text-3xl font-black text-primary mt-1">${finalPrice.toFixed(2)}</div>
              </div>
              <div className="p-5 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center">
                <div className="text-xs uppercase font-bold text-emerald-500">Total Money Saved</div>
                <div className="text-3xl font-black text-emerald-500 mt-1">${savings.toFixed(2)}</div>
              </div>
            </div>
          </div>
        );
      }

      case 'time-duration-calc': {
        const [h1, m1] = valA.includes(':') ? valA.split(':').map(Number) : [9, 0];
        const [h2, m2] = valB.includes(':') ? valB.split(':').map(Number) : [17, 30];

        let startMins = (h1 || 0) * 60 + (m1 || 0);
        let endMins = (h2 || 0) * 60 + (m2 || 0);
        if (endMins < startMins) endMins += 24 * 60; // Next day fallback

        const diffMins = endMins - startMins;
        const durHours = Math.floor(diffMins / 60);
        const durMins = diffMins % 60;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Start Time (24h or HH:MM)</label>
                <input
                  type="time"
                  value={valA.includes(':') ? valA : '09:00'}
                  onChange={(e) => setValA(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">End Time (24h or HH:MM)</label>
                <input
                  type="time"
                  value={valB.includes(':') ? valB : '17:30'}
                  onChange={(e) => setValB(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl text-center">
              <div className="text-xs uppercase font-bold text-primary mb-1">Elapsed Time Duration</div>
              <div className="text-4xl font-black text-primary">
                {durHours} Hours {durMins} Minutes
              </div>
              <div className="text-xs text-stone-500 dark:text-zinc-400 mt-2 font-bold">
                Total Elapsed: {diffMins} Minutes ({ (diffMins / 60).toFixed(2) } Decimal Hours)
              </div>
            </div>
          </div>
        );
      }

      case 'salary-calc': {
        const hourlyRate = parseFloat(valA) || 25;
        const hoursWeek = parseFloat(valB) || 40;

        const weeklyGross = hourlyRate * hoursWeek;
        const monthlyGross = (weeklyGross * 52) / 12;
        const annualGross = weeklyGross * 52;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Hourly Wage Rate ($)</label>
                <input
                  type="number"
                  value={valA}
                  onChange={(e) => setValA(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Hours Worked / Week</label>
                <input
                  type="number"
                  value={valB}
                  onChange={(e) => setValB(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-center">
                <div className="text-xs uppercase font-bold text-primary">Annual Salary</div>
                <div className="text-2xl font-black text-primary mt-1">${annualGross.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center">
                <div className="text-xs uppercase font-bold text-stone-500">Monthly Gross</div>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">${monthlyGross.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center">
                <div className="text-xs uppercase font-bold text-stone-500">Weekly Pay</div>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">${weeklyGross.toFixed(2)}</div>
              </div>
            </div>
          </div>
        );
      }

      case 'compound-interest-calc': {
        const principal = parseFloat(valA) || 5000;
        const ratePct = parseFloat(valB) || 7;
        const years = parseFloat(valC) || 10;

        const r = ratePct / 100;
        const futureValue = principal * Math.pow(1 + r, years);
        const interestEarned = futureValue - principal;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Initial Principal ($)</label>
                <input
                  type="number"
                  value={valA}
                  onChange={(e) => setValA(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  value={valB}
                  onChange={(e) => setValB(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Duration (Years)</label>
                <input
                  type="number"
                  value={valC}
                  onChange={(e) => setValC(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-primary/10 border border-primary/20 rounded-2xl text-center">
                <div className="text-xs uppercase font-bold text-primary">Future Investment Value</div>
                <div className="text-3xl font-black text-primary mt-1">${futureValue.toFixed(2)}</div>
              </div>
              <div className="p-5 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center">
                <div className="text-xs uppercase font-bold text-emerald-500">Total Interest Earned</div>
                <div className="text-3xl font-black text-emerald-500 mt-1">${interestEarned.toFixed(2)}</div>
              </div>
            </div>
          </div>
        );
      }

      case 'electricity-bill-calc': {
        const watts = parseFloat(valA) || 1000;
        const hoursDay = parseFloat(valB) || 8;
        const costKwh = parseFloat(valC) || 0.15;

        const dailyKwh = (watts * hoursDay) / 1000;
        const monthlyKwh = dailyKwh * 30;
        const monthlyCost = monthlyKwh * costKwh;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Appliance Wattage (Watts)</label>
                <input
                  type="number"
                  value={valA}
                  onChange={(e) => setValA(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Hours Used / Day</label>
                <input
                  type="number"
                  value={valB}
                  onChange={(e) => setValB(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Cost per kWh ($)</label>
                <input
                  type="number"
                  value={valC}
                  onChange={(e) => setValC(e.target.value)}
                  step="0.01"
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-primary/10 border border-primary/20 rounded-2xl text-center">
                <div className="text-xs uppercase font-bold text-primary">Estimated Monthly Electricity Bill</div>
                <div className="text-3xl font-black text-primary mt-1">${monthlyCost.toFixed(2)}</div>
              </div>
              <div className="p-5 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center">
                <div className="text-xs uppercase font-bold text-stone-500">Monthly Energy Usage</div>
                <div className="text-3xl font-black text-stone-900 dark:text-white mt-1">{monthlyKwh.toFixed(1)} kWh</div>
              </div>
            </div>
          </div>
        );
      }

      default: {
        const numA = parseFloat(valA) || 100;
        const numB = parseFloat(valB) || 10;
        const result = numA * numB;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Primary Value</label>
                <input
                  type="number"
                  value={valA}
                  onChange={(e) => setValA(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Secondary Multiplier</label>
                <input
                  type="number"
                  value={valB}
                  onChange={(e) => setValB(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="p-6 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center">
              <span className="text-xs uppercase font-bold text-stone-500">Calculation Summary</span>
              <div className="text-3xl font-black text-primary mt-1">{result.toLocaleString()}</div>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
        <FiSliders size={18} /> Interactive Calculator Engine
      </div>
      {renderCalculatorContent()}
    </div>
  );
};
