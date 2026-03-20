import LoginForm from "@components/loginForm";
import style from '@styles/home.module.css'
import { getTranslations } from "next-intl/server";

const LoginPage = async () => {
    const t = await getTranslations('login');
    return (
        <>
            <main className={style.main}>
                <span className="flex flex-row justify-center items-center">
                    <h1 className={style.h1}>{t('title')}</h1>
                    <section className="flex flex-col justify-center">
                        <LoginForm />
                    </section>
                </span>
            </main>
        </>
    );
};
export default LoginPage;