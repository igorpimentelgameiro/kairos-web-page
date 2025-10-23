import {useState} from "react";
import type {FormEvent} from "react";
import {push, ref, serverTimestamp} from "firebase/database";
import {firebaseDatabase} from "@dominio/firebase/app";
import AdminDashboard from "@pagina/AdminDashboard";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        try {
            setSubmitting(true);
            const referencia = ref(firebaseDatabase, "admin/logins");
            await push(referencia, {
                username,
                password,
                createdAt: serverTimestamp(),
            });
            setLoggedIn(true);
        } catch (err) {
            console.error("[AdminLogin] falha ao registrar login", err);
            setError("Não foi possível acessar agora. Tente novamente em instantes.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loggedIn) {
        return <AdminDashboard/>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
            <div className="w-full max-w-sm space-y-6 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-16 rounded-2xl bg-white/80 dark:bg-neutral-900 border border-black/10 dark:border-white/10 shadow flex items-center justify-center">
                        <img src="/assets/img/logo.png" alt="Movimento Kairós" className="h-14 w-14 object-contain"/>
                    </div>
                    <div className="text-center">
                        <h1 className="text-xl font-semibold tracking-tight">Acesso Administrativo</h1>
                        <p className="text-sm text-muted-foreground">Área restrita do Movimento Kairós</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6 bg-card text-card-foreground border border-black/5 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                    <div className="w-full flex flex-col gap-3">
                        <label htmlFor="admin-login" className="text-sm font-semibold text-muted-foreground uppercase tracking-wide text-left">
                            Login
                        </label>
                        <input
                            id="admin-login"
                            className="w-full border rounded-xl px-3 py-2 text-sm bg-white text-neutral-900 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 dark:bg-neutral-900 dark:text-white dark:placeholder:text-slate-400 dark:border-neutral-700"
                            placeholder="usuário ou e-mail"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            autoComplete="username"
                            required
                        />
                    </div>
                    <div className="w-full flex flex-col gap-3">
                        <label htmlFor="admin-password" className="text-sm font-semibold text-muted-foreground uppercase tracking-wide text-left">
                            Senha
                        </label>
                        <input
                            id="admin-password"
                            type="password"
                            className="w-full border rounded-xl px-3 py-2 text-sm bg-white text-neutral-900 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 dark:bg-neutral-900 dark:text-white dark:placeholder:text-slate-400 dark:border-neutral-700"
                            placeholder="senha"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={!username || !password || submitting}
                    >
                        {submitting ? "Entrando..." : "Entrar"}
                    </button>
                    {error ? (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    ) : null}
                    <button
                        type="button"
                        className="w-full text-sm font-semibold text-primary hover:underline transition"
                        onClick={() => {
                            // Placeholder até implementação do fluxo de recuperação
                            alert("Entre em contato com o suporte do Movimento Kairós para recuperar o acesso.");
                        }}
                    >
                        Esqueci minha senha
                    </button>
                </form>
                <p className="text-xs text-center text-muted-foreground">
                    Este acesso é restrito aos administradores autorizados.
                </p>
            </div>
        </div>
    );
}
