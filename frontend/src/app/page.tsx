"use client";

import { useState } from "react";

interface ApiResponse {
  data_nascimento_enviada: string;
  vigencia: {
    ano_referencia: number;
    data_inicio: string;
    data_fim: string;
  };
  ano_pessoal: number;
  palavra_chave: string;
  breve_descricao: string;
  previsoes_detalhadas: {
    amor: string;
    familiar: string;
    saude: string;
    profissional: string;
    financeiro: string;
    social: string;
    mental: string;
    espiritual: string;
  };
}

export default function HomePage() {
  const [birthDate, setBirthDate] = useState(""); // yyyy-mm-dd
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Converte yyyy-mm-dd para dd-mm-yyyy
  function formatDateForApi(dateStr: string) {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }

  async function fetchData() {
    if (!birthDate) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const formattedDate = formatDateForApi(birthDate);
      console.log("Data formatada para API:", formattedDate);

      // Aqui a mudança: URL local do proxy
      const res = await fetch(`/api/personal-year?birth=${formattedDate}`);
      console.log("Status da resposta:", res.status);

      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }

      const json = await res.json();
      console.log("Resposta JSON da API:", json);

      setData(json);
    } catch (e) {
      console.error("Erro na requisição:", e);
      setError(
        "Não foi possível buscar os dados. Verifique sua conexão e a data e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!birthDate) {
      setError("Por favor, selecione uma data.");
      return;
    }
    fetchData();
  }

  function reset() {
    setData(null);
    setBirthDate("");
    setError("");
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      {!data ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label htmlFor="birthDate" className="font-semibold text-lg">
            Data de nascimento:
          </label>
          <input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="border border-gray-400 rounded px-4 py-2"
            max={new Date().toISOString().split("T")[0]} // não permite data futura
          />
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Buscando..." : "Buscar previsão"}
          </button>
        </form>
      ) : (
        <section className="bg-gray-50 p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">
            Resultado para: {data.data_nascimento_enviada}
          </h2>
          <p className="text-lg mb-2">
            <strong>Ano Pessoal:</strong> {data.ano_pessoal} - {data.palavra_chave}
          </p>
          <p className="mb-4 italic">{data.breve_descricao}</p>

          <div className="grid grid-cols-1 gap-3">
            {Object.entries(data.previsoes_detalhadas).map(([key, val]) => (
              <div key={key} className="bg-white p-4 rounded shadow-sm">
                <strong className="capitalize">{key}:</strong> {val}
              </div>
            ))}
          </div>

          <button
            onClick={reset}
            className="mt-6 bg-gray-700 text-white py-3 px-6 rounded hover:bg-gray-800"
          >
            Testar outra data
          </button>
        </section>
      )}
    </main>
  );
}
