import {FirebaseError} from "firebase/app";
import {
    type Unsubscribe,
    type User,
    type UserCredential,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import {firebaseAuth} from "@dominio/firebase/app";

export const entrarComCredenciais = async (
    identificador: string,
    senha: string,
): Promise<UserCredential> => {
    if (!identificador || !senha) {
        throw new FirebaseError("auth/invalid-login-credentials", "Credenciais inválidas");
    }
    return signInWithEmailAndPassword(firebaseAuth, identificador, senha);
};

export const sair = async (): Promise<void> => {
    await signOut(firebaseAuth);
};

export const observarEstadoAutenticacao = (
    callback: (usuario: User | null) => void,
): Unsubscribe => onAuthStateChanged(firebaseAuth, callback);
