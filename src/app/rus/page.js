"use client"
import en from "@/app/locales/en.json"
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

function getThreeUniqueNumbers(exclude, pl) {
  const numbers = [1, 2, 3, 4, 5].filter(n => n !== exclude);
  const result = [];

  while (result.length < 3) {
    const index = Math.floor(Math.random() * numbers.length);
    result.push(numbers.splice(index, 1)[0]);
  }

  return result;
}

export default function Rus() {
    const l = en;
    const [page, setPage] = useState(1);
    const [mode, setMode] = useState("test");
    const [word, setWord] = useState(null);
    const [wordCase, setWordCase] = useState(null);
    const [plural, setPlural] = useState(false);

    const [answered, setAnswered] = useState(false);
    const [correct, setCorrect] = useState(false);

    const [answers, setAnswers] = useState([]);

    const supabaseUrl = "https://qvtjiinmoosyootzrjhs.supabase.co";
    const supabaseKey = "sb_publishable_R41KZwttRTglv0d1Z6L0Eg_-eWIrqmk";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const fetchWord = async (type) => {
        const minId = Math.floor(Math.random() * (394250 + 1));
        const randId = Math.floor(Math.random() * (999 + 1));

        const { data, error } = await supabase
            .from('lemmas')
            .select('*')
            .eq('post', type)  
            .gt('id', minId);  
        

        if (error) {
            console.error("Ошибка при получении слова:", error);
            return null;
        }
        console.log(data[randId]);

        const pl = Math.random() < 0.5 && data[randId].forms.length > 6;
        setPlural(pl)
        const cs = Math.floor(Math.random() * 5) + 1 + (pl ? 6 : 0);

        switch(cs) {
            case 1 + (pl ? 6 : 0):
                setWordCase(l.cases.genitive)
                break;
            case 2 + (pl ? 6 : 0):
                setWordCase(l.cases.dative)
                break;
            case 3 + (pl ? 6 : 0):
                setWordCase(l.cases.accusative)
                break;
            case 4 + (pl ? 6 : 0):
                setWordCase(l.cases.instrumental)
                break;
            case 5 + (pl ? 6 : 0):
                setWordCase(l.cases.locative)
                break;
        }
        let ans = [];
        const a = Math.floor(Math.random() * 3);
        const falseCases = getThreeUniqueNumbers(cs, data[randId].forms.length > 6);
        let j = 0;
        for (let i = 0; i < 4; i++) {
            if (i == a) {
                ans.push({id: i, ans: data[randId].forms[cs].form, isCorrect: true})
            } else {
                if (data[randId].forms[cs].form !== data[randId].forms[falseCases[j]].form)
                    ans.push({id: i, ans: data[randId].forms[falseCases[j]].form, isCorrect: false})
                j++;
            }
        }
        setAnswers(ans);
        setWord(pl ? data[randId].forms[6].form : data[randId].lemma)
    }

    return (
        <div className="min-h-screen bg-[#0D101C] text-white">
            <div className="flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-4xl font-extrabold mb-4">{l.russian.title}</h2>
                <p className="text-lg mb-8">{l.russian.subtitle}</p>

                <div className="wt-1 wb-1 border-b-2 border-[#DB2B39] w-1/2 flex gap-5 transition-all duration-1000 mt-4">
                    <button
                        className={`text-lg pr-2 pl-2 rounded-t-lg transition-colors duration-500 ${Number(page) == Number(1) ? "bg-[#DB2B39]" : "hover:text-[#DB2B39] "}`}
                        onClick={() => setPage(1)}
                    >
                        {l.russian.noun}
                    </button>

                    <button
                        className={`text-lg pr-2 pl-2 rounded-t-lg transition-colors duration-500 ${Number(page) == Number(2) ? "bg-[#DB2B39]" : "hover:text-[#DB2B39] "}`}
                        onClick={() => setPage(2)}
                    >
                        {l.russian.verb}
                    </button>

                    <button
                        className={`text-lg pr-2 pl-2 rounded-t-lg transition-colors duration-500 ${Number(page) == Number(3) ? "bg-[#DB2B39]" : "hover:text-[#DB2B39] "}`}
                        onClick={() => setPage(3)}
                    >
                        {l.russian.adjective}
                    </button>
                </div>
                {answered ? (
                    <div>
                        <h1 className="text-xl font-bold p-0.5">{correct ? l.russian.correct : l.russian.incorrect}</h1>
                        <div className="flex gap-3 w-full">
                            {correct ? (null) : (
                                <button
                                    className="flex-1 font-semibold mt-4 px-6 py-1 bg-[#DB2B39] text-white rounded-xl shadow hover:bg-[#AE1E2A] transition"
                                    onClick={() => {
                                        setAnswered(false)
                                        setCorrect(false)
                                    }}
                                >
                                    {l.russian.yesButton}
                                </button>
                            )}

                            <button
                                className="flex-1 font-semibold mt-4 px-6 py-1 bg-[#DB2B39] text-white rounded-xl shadow hover:bg-[#AE1E2A] transition"
                                onClick={() => {
                                    setAnswered(false)
                                    setCorrect(false)
                                    setWord(null)
                                }}
                            >
                                {l.russian.noButton}
                            </button>

                            <button
                                className="flex-1 font-semibold mt-4 px-6 py-1 bg-[#DB2B39] text-white rounded-xl shadow hover:bg-[#AE1E2A] transition"
                                onClick={() => {
                                    setAnswered(false)
                                    setCorrect(false)
                                    fetchWord("NOUN")
                                }}
                            >
                                {l.russian.nextWord}
                            </button>
                        </div>
                    </div>
                ) : word ? (
                        <div className="mt-2 flex flex-col items-start gap-4 w-1/2 ml-4">
                            <h1 className="text-xl font-bold p-0.5">{word}</h1>
                            <p>{l.russian.choose + (plural ? l.plurality.plural : l.plurality.single) + wordCase}</p>
                            {String(mode) === String("test") ? (
                                <div className="flex flex-col gap-0.5">
                                    {answers.map(answer => (
                                        <button
                                            key={answer.id}
                                            className="mt-4 px-6 py-3 bg-[#DB2B39] text-white rounded-xl shadow hover:bg-[#AE1E2A] transition"
                                            onClick={() => {
                                                if (answer.isCorrect)
                                                    setCorrect(true);
                                                else 
                                                    setCorrect(false)
                                                setAnswered(true)
                                            }}
                                        >
                                            {answer.ans}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-2 flex flex-col items-start gap-4 w-1/2 ml-4">
                            {page === 1 ? (
                                <div className="flex flex-col items-start">
                                    <h1 className="text-xl font-bold p-0.5">{l.russian.noun}</h1>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="language"
                                        value="ru"
                                        checked={mode === "test"}
                                        onChange={() => setMode("test")}
                                        className="accent-blue-500"
                                    />
                                        {l.russian.modetest}
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="language"
                                        value="cz"
                                        checked={mode === "full"}
                                        onChange={() => setMode("full")}
                                        className="accent-blue-500"
                                    />
                                        {l.russian.modefull}
                                    </label>

                                    <button
                                        className="mt-4 px-6 py-3 bg-[#DB2B39] text-white rounded-xl shadow hover:bg-[#AE1E2A] transition"
                                        onClick={() => fetchWord("NOUN")}
                                    >
                                        {l.russian.load}
                                    </button>
                                </div>
                            ) : null}
                            {page === 2 ? (
                                // <div className="flex flex-col items-start">
                                //     <h1 className="text-xl font-bold p-0.5">{l.russian.verb}</h1>

                                //     <label className="flex items-center gap-2 cursor-pointer">
                                //     <input
                                //         type="radio"
                                //         name="language"
                                //         value="ru"
                                //         checked={mode === "test"}
                                //         onChange={() => setMode("test")}
                                //         className="accent-blue-500"
                                //     />
                                //         {l.russian.modetest}
                                //     </label>

                                //     <label className="flex items-center gap-2 cursor-pointer">
                                //     <input
                                //         type="radio"
                                //         name="language"
                                //         value="cz"
                                //         checked={mode === "full"}
                                //         onChange={() => setMode("full")}
                                //         className="accent-blue-500"
                                //     />
                                //         {l.russian.modefull}
                                //     </label>

                                //     <button
                                //         className="mt-4 px-6 py-3 bg-[#DB2B39] text-white rounded-xl shadow hover:bg-[#AE1E2A] transition"
                                //         onClick={() => fetchWord("VERB")}
                                //     >
                                //         {l.russian.load}
                                //     </button>
                                // </div>
                                <h1>We're still working on it!</h1>
                            ) : null}
                            {page === 3 ? (
                                <div className="flex flex-col items-start">
                                    {/* <h1 className="text-xl font-bold p-0.5">{l.russian.adjective}</h1>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="language"
                                        value="ru"
                                        checked={mode === "test"}
                                        onChange={() => setMode("test")}
                                        className="accent-blue-500"
                                    />
                                        {l.russian.modetest}
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="language"
                                        value="cz"
                                        checked={mode === "full"}
                                        onChange={() => setMode("full")}
                                        className="accent-blue-500"
                                    />
                                        {l.russian.modefull}
                                    </label>

                                    <button
                                        className="mt-4 px-6 py-3 bg-[#DB2B39] text-white rounded-xl shadow hover:bg-[#AE1E2A] transition"
                                        onClick={() => fetchWord("ADJF")}
                                    >
                                        {l.russian.load}
                                    </button> */}
                                    <h1>We're still working on it!</h1>
                                </div>
                            ) : null}
                        </div>
                    )
                }
            </div>
        </div>
    );
}