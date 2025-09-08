"use client"
import en from "@/app/locales/en.json"
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

function getRandomNumbers(max) {
  const count = Math.min(max + 1, 3);

  const numbers = new Set();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * (max + 1)));
  }

  return Array.from(numbers);
}

export default function Rus() {
    const [page, setPage] = useState(1);
    const [mode, setMode] = useState("test");
    const [word, setWord] = useState(null);
    const [wordCase, setWordCase] = useState(null);
    const [wordGend, setWordGend] = useState(null);
    const [plural, setPlural] = useState(false);

    const [answered, setAnswered] = useState(false);
    const [correct, setCorrect] = useState(false);

    const [loading, setLoading] = useState(false);

    const [answers, setAnswers] = useState([]);
    const l = en;

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
        let gender = type === "NOUN" ? null : Math.round(Math.random() * 2);
        switch (gender) {
            case 0:
                gender = "masc";
                setWordGend(l.gender.masc);
                break;
            case 1:
                gender = "femn";
                setWordGend(l.gender.femn);
                break;
            case 2:
                gender = "neut";
                setWordGend(l.gender.neut);
                break;
            default:
                data[randId].forms[0].grammemes.forEach(g => {
                    if (g === "masc" || g === "femn" || g === "neut")
                        gender = g;
                });
                break;
        }

        console.log(gender);

        const wordFun = data[randId];  
        let pl = (Math.round(Math.random()) + 1) == 1 ? "plur" : "sing";
        let plFlag = false;
        wordFun.forms.forEach((form) => {
            if (form.grammemes.indexOf("plur") !== -1)
                plFlag = true;
        });
        if (!plFlag) 
            pl = "sing";
        setPlural(pl === "plur");
        let cs = Math.floor(Math.random() * 4) + 1;

        switch (cs) {
            case 1:
                cs = "gent"
                setWordCase(l.cases.genitive)
                break;
            case 2:
                cs = "datv"
                setWordCase(l.cases.dative)
                break;
            case 3:
                cs = "accs"
                setWordCase(l.cases.accusative)
                break;
            case 4:
                cs = "ablt"
                setWordCase(l.cases.instrumental)
                break;
            case 5:
                cs = "loct"
                setWordCase(l.cases.locative)
                break;
        }


        const ansForm = wordFun.forms.find((form) => {
            return form.grammemes.indexOf(cs) !== -1 && form.grammemes.indexOf(pl) !== -1 && (form.grammemes.indexOf(gender) !== -1 || (form.grammemes.indexOf("femn") === -1 && form.grammemes.indexOf("masc") === -1 && form.grammemes.indexOf("neut") === -1));
        });
        console.log(wordFun); console.log(pl); console.log(cs); console.log(ansForm);

        let formsToAns = wordFun.forms.filter((f) => {
            return (f.grammemes.indexOf(cs) === -1 || f.grammemes.indexOf(pl) === -1) && f.form !== ansForm.form && f.grammemes.indexOf("V-be") === -1;
        });

        formsToAns = Array.from(
            new Set(formsToAns.map(item => item.form))
        );
        //console.log("\n"); console.log(formsToAns);

        const a = Math.floor(Math.random() * 3);
        const aInds = getRandomNumbers(formsToAns.length - 1);
        let ans = [];
        let j = 0;
        for (let i = 0; i < Math.min(formsToAns.length, 4); i++) {
            if (i === a) {
                ans.push({id: i, ans: ansForm.form, isCorrect: true});
            } else {
                ans.push({id: i, ans: formsToAns[aInds[j]], isCorrect: false});
                j++;
            }
        }

        setAnswers(ans);
        setAnswered(false);
        setCorrect(false);
        setLoading(false);
        setWord(data[randId])
    }

    return (
        <div className="min-h-screen bg-[#0D101C] text-white">
            <div className="flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-4xl font-extrabold mb-4">{l.russian.title}</h2>
                <p className="text-lg mb-8">{l.russian.subtitle}</p>

                <div className="justify-center wt-1 wb-1 border-b-2 border-[#DB2B39] w-2/3 flex gap-5 transition-all duration-1000 mt-4">
                    <button
                        className={`text-lg pr-2 pl-2 rounded-t-lg transition-colors duration-500 ${Number(page) == Number(1) ? "bg-[#DB2B39]" : "hover:text-[#DB2B39] "}`}
                        onClick={() => {
                            setPage(1)
                            setAnswered(false)
                            setCorrect(false)
                            setWord(null)
                            setWordCase(null)
                            setWordGend(null)
                        }}
                    >
                        {l.russian.noun}
                    </button>

                    <button
                        className={`text-lg pr-2 pl-2 rounded-t-lg transition-colors duration-500 ${Number(page) == Number(2) ? "bg-[#DB2B39]" : "hover:text-[#DB2B39] "}`}
                        onClick={() => {
                            setPage(2)
                            setAnswered(false)
                            setCorrect(false)
                            setWord(null)
                            setWordCase(null)
                            setWordGend(null)
                        }}
                    >
                        {l.russian.verb}
                    </button>

                    <button
                        className={`text-lg pr-2 pl-2 rounded-t-lg transition-colors duration-500 ${Number(page) == Number(3) ? "bg-[#DB2B39]" : "hover:text-[#DB2B39] "}`}
                        onClick={() => {
                            setPage(3)
                            setAnswered(false)
                            setCorrect(false)
                            setWord(null)
                            setWordCase(null)
                            setWordGend(null)
                        }}
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
                                    setLoading(true)
                                    fetchWord(word.post)
                                }}
                            >
                                {loading ? l.russian.loading : l.russian.nextWord}
                            </button>

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
                        </div>
                    </div>
                ) : word ? (
                        <div className="mt-2 flex flex-col items-center gap-4 ml-4">
                            <h1 className="text-xl font-bold p-0.5">{word.lemma}</h1>
                            <p className="w-2/3">{l.russian.choose + (plural ? l.plurality.plural : ((wordGend ? wordGend : "") + l.plurality.single)) + wordCase}</p>
                            {String(mode) === String("test") ? (
                                <div className="flex flex-col gap-0.5">
                                    {answers.map(answer => (
                                        <button
                                            key={answer.id}
                                            className="mt-4 px-6 py-2 bg-[#29335C] text-white rounded-xl shadow hover:bg-[#DB2B39] transition"
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
                        <div className="mt-2 flex flex-col items-start gap-4 ml-4">
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
                                        onClick={() => {
                                            fetchWord("NOUN")
                                            setLoading(true)
                                        }}
                                    >
                                        {loading ? l.russian.loading : l.russian.load}
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
                                <h1>We are still working on it!</h1>
                            ) : null}
                            {page === 3 ? (
                                <div className="flex flex-col items-start">
                                    <h1 className="text-xl font-bold p-0.5">{l.russian.adjective}</h1>

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
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    )
                }
            </div>
        </div>
    );
}