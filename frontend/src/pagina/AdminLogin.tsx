import {useEffect, useState} from "react";
import type {FormEvent} from "react";
import {FirebaseError} from "firebase/app";
import {
    entrarComCredenciais,
    observarEstadoAutenticacao,
} from "@dominio/servicos/authServico";
import AdminDashboard from "@pagina/AdminDashboard";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const mensagemErroPadrao =
        "Não foi possível acessar agora. Verifique seus dados ou tente novamente em instantes.";

    useEffect(() => {
        const unsubscribe = observarEstadoAutenticacao((usuario) => {
            setLoggedIn(Boolean(usuario));
            setCheckingAuth(false);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        const credencial = username.trim();
        try {
            setSubmitting(true);
            await entrarComCredenciais(credencial, password);
            setLoggedIn(true);
        } catch (err) {
            console.error("[AdminLogin] falha ao autenticar", err);
            if (err instanceof FirebaseError) {
                switch (err.code) {
                    case "auth/invalid-login-credentials":
                    case "auth/invalid-credential":
                    case "auth/user-not-found":
                    case "auth/wrong-password":
                        setError("Credenciais incorretas. Verifique seu login e senha.");
                        break;
                    case "auth/network-request-failed":
                        setError("Falha na comunicação com o servidor. Verifique sua conexão.");
                        break;
                    default:
                        setError(mensagemErroPadrao);
                }
            } else {
                setError(mensagemErroPadrao);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
                <div className="text-center space-y-4">
                    <img src="/assets/img/logo.png" alt="Movimento Kairós" className="h-16 w-16 mx-auto object-contain"/>
                    <p className="text-sm text-muted-foreground">Verificando sessão...</p>
                </div>
            </div>
        );
    }

    if (loggedIn) {
        return <AdminDashboard/>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-2xl border bg-white shadow flex items-center justify-center">
                            <img src="/assets/img/logo.png" alt="Movimento Kairós" className="h-12 w-12 object-contain"/>
                        </div>
                        <div className="space-y-0.5">
                            <h1 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Movimento Kairós</h1>
                            <p className="text-xs text-muted-foreground/80">Plataforma administrativa</p>
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                window.location.href = "/";
                            }}
                            className="inline-flex w-full items-center justify-center rounded-xl border border-primary/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary transition hover:bg-primary/10 sm:w-auto"
                        >
                            Ir para o site
                        </button>
                    </div>
                </header>

                <div className="flex justify-center">
                    <div className="w-full max-w-sm space-y-6 text-center">
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold tracking-tight">Acesso Administrativo</h2>
                            <p className="text-sm text-muted-foreground">Área restrita do Movimento Kairós</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
                            <div className="w-full flex flex-col gap-3">
                                <label htmlFor="admin-login" className="text-sm font-semibold text-muted-foreground uppercase tracking-wide text-left">
                                    Login
                                </label>
                                <input
                                    id="admin-login"
                                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
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
                                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
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
                            {/* <button
                                type="button"
                                className="w-full text-sm font-semibold text-primary hover:underline transition"
                                onClick={() => {
                                    // Placeholder até implementação do fluxo de recuperação
                                    alert("Entre em contato com o suporte do Movimento Kairós para recuperar o acesso.");
                                }}
                            >
                                Esqueci minha senha
                            </button>*/}
                        </form>
                        <p className="text-xs text-center text-muted-foreground">
                            Este acesso é restrito aos administradores autorizados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
