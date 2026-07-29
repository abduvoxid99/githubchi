import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Foydalanish shartlari — githubchi",
  description:
    "githubchi xizmatidan foydalanish shartlari, majburiyatlar va cheklovlar",
};

export default function ShartlarPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <Link href="/" className="app-header__logo">
              githubchi
            </Link>
            <span className="app-header__tagline">foydalanish shartlari</span>
          </div>
          <Link
            href="/login"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            Kirish
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-8 sm:px-8 sm:py-10">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Foydalanish shartlari
          </h1>
          <p className="mt-2 text-sm text-[var(--fg-muted)]">
            Oxirgi yangilanish: 29-iyul 2026 · Amal qilish boshlanishi: xizmatdan
            foydalanish boshlangan paytdan
          </p>

          <div className="terms prose-terms mt-8 space-y-8 text-sm leading-relaxed text-[var(--fg)]">
            <section>
              <h2>1. Kirish va kelishuvning kuchga kirishi</h2>
              <p>
                Ushbu Foydalanish shartlari (keyingi o‘rinlarda — «Shartlar»)
                githubchi veb-xizmati (keyingi o‘rinlarda — «Xizmat», «biz»,
                «bizning») bilan Foydalanuvchi (keyingi o‘rinlarda — «Siz»,
                «Foydalanuvchi») o‘rtasidagi huquqiy munosabatlarni tartibga
                soladi. Xizmat GitHub contribution graphiga (yashil kataklar /
                «yashil nuqtalar») oldindan tanlangan naqsh (pattern) asosida
                sanalangan (backdated) commitlar yozish imkonini beradi.
              </p>
              <p>
                Xizmatga kirish, GitHub orqali autentifikatsiya qilish, dashboarddan
                foydalanish, preview ko‘rish, commit yaratish, tarixni ko‘rish yoki
                harakatni bekor qilish orqali Siz ushbu Shartlarni to‘liq o‘qib
                chiqqaningizni, tushunganingizni va ularga roziligingizni
                bildirgan hisoblanasiz. Agar Shartlarning biror bandiga
                rozi bo‘lmasangiz, Xizmatdan foydalanmang va mavjud sessiyani
                darhol yakunlang.
              </p>
              <p>
                Biz Shartlarni istalgan vaqtda yangilash huquqini saqlaymiz.
                Yangilangan matn Xizmat sahifasida e’lon qilingan paytdan kuchga
                kiradi. Yangilanishdan keyin Xizmatdan davom etgan foydalanish
                yangi tahrirga rozilik deb baholanadi. Muhim o‘zgarishlar bo‘lsa,
                imkon qadar Xizmat interfeysida yoki boshqa qulay usulda
                xabardor qilishga harakat qilamiz, biroq bu majburiyat emas.
              </p>
            </section>

            <section>
              <h2>2. Atamalar</h2>
              <ul>
                <li>
                  <strong>Xizmat / githubchi</strong> — veb-interfeys, API,
                  tegishli infratuzilma va ular orqali taqdim etiladigan
                  funksiyalar majmui.
                </li>
                <li>
                  <strong>GitHub</strong> — GitHub, Inc. (yoki uning huquqiy
                  vorislari) tomonidan taqdim etiladigan platforma; Xizmat undan
                  mustaqil uchinchi tomon mahsuloti.
                </li>
                <li>
                  <strong>Harakat (Action)</strong> — bitta pattern konfiguratsiyasi
                  bo‘yicha commitlar yaratish yoki ularni bekor qilish
                  operatsiyasi.
                </li>
                <li>
                  <strong>Fork / githubchi repo</strong> — Foydalanuvchi
                  akkauntidagi <code>username/githubchi</code> nomli ombor
                  (odatda upstream dan fork).
                </li>
                <li>
                  <strong>Contribution graph</strong> — GitHub profilidagi
                  yillik faollik issiqlik xaritasi.
                </li>
                <li>
                  <strong>Force push / revert</strong> — oldingi HEAD
                  holatiga qattiq qaytarish va masofaviy branchni majburiy
                  yangilash.
                </li>
              </ul>
            </section>

            <section>
              <h2>3. Xizmatning mohiyati va cheklangan kafolatlar</h2>
              <p>
                Xizmat «boricha» (as is) va «mavjudligi bo‘yicha» (as available)
                taqdim etiladi. Biz Xizmat uzluksiz, xatosiz, xavfsiz yoki
                Foydalanuvchi kutgan natijani kafolatlamaymiz.
              </p>
              <p>
                Xususan, quyidagilar kafolatlanmaydi va ba’zan sodir
                bo‘lmasligi mumkin:
              </p>
              <ul>
                <li>
                  GitHub contribution graphida yashil kataklarning darhol yoki
                  umuman paydo bo‘lishi;
                </li>
                <li>
                  graphning yangilanish muddati (odatda bir necha daqiqadan 24
                  soatgacha, ba’zan undan uzoqroq);
                </li>
                <li>
                  bekor qilingan (o‘chirilgan) harakatdan keyin yashil
                  nuqtalarning to‘liq yo‘qolishi;
                </li>
                <li>
                  GitHub tomonidan commitlarning contribution sifatida
                  hisoblanishi (email, attributsiya, private/public sozlamalar,
                  GitHub ichki qoidalari ta’sir qilishi mumkin);
                </li>
                <li>
                  upstream pull requestning qabul qilinishi yoki ko‘rib
                  chiqilishi.
                </li>
              </ul>
              <p>
                Xizmat «ko‘ngilochar / eksperimental» vosita sifatida mo‘ljallangan.
                U rezyume, ishga joylashish, grant, tanlov yoki boshqa rasmiy
                baholashlarda haqiqiy dasturiy ish faoliyatini almashtirish uchun
                mo‘ljallanmagan. Graphdagi naqshni uchinchi shaxslarga «haqiqiy
                kundalik commit tarixi» deb taqdim etish uchun mas’uliyat
                to‘liq Foydalanuvchiga yuklatiladi.
              </p>
            </section>

            <section>
              <h2>4. Hisob, autentifikatsiya va ruxsatlar</h2>
              <p>
                Xizmatga kirish faqat GitHub OAuth orqali amalga oshiriladi.
                Alohida parol yaratilmaydi. Siz GitHub akkauntingizga to‘liq
                nazorat qila olishingiz va kirish huquqingiz bo‘lishi shart.
              </p>
              <p>
                Autentifikatsiya jarayonida Xizmat (yoki uning autentifikatsiya
                provayderi) GitHubdan foydalanuvchi identifikatori, login,
                ism, email, avatar va foydalanuvchi access tokenini olishi
                mumkin. Token Xizmatning backendida saqlanishi va quyidagi
                maqsadlarda ishlatilishi mumkin:
              </p>
              <ul>
                <li>foydalanuvchini identifikatsiya qilish;</li>
                <li>
                  <code>githubchi</code> reponi tekshirish, fork qilish, clone
                  qilish;
                </li>
                <li>commitlar yozish va <code>main</code> branchga push qilish;</li>
                <li>pull request ochish yoki mavjudini qayta ishlatish;</li>
                <li>revert / force-push orqali harakatni bekor qilish;</li>
                <li>akkaunt yaratilgan yil kabi metama’lumotlarni olish.</li>
              </ul>
              <p>
                So‘raladigan tipik scope’lar: <code>read:user</code>,{" "}
                <code>user:email</code>, <code>public_repo</code>. Siz ushbu
                ruxsatlarning oqibatlarini tushungan holda rozilik berasiz.
                Tokenni bekor qilish yoki OAuth app ruxsatini olib tashlash
                GitHub sozlamalaridan amalga oshiriladi; shundan so‘ng Xizmatning
                ayrim funksiyalari ishlamay qolishi mumkin.
              </p>
              <p>
                Sizning akkauntingiz orqali amalga oshirilgan barcha
                harakatlar — shu jumladan uchinchi shaxs sizning sessiyangizdan
                foydalangan holatlar — sizning mas’uliyatingiz ostida deb
                hisoblanadi. Sessiyani himoya qilish, qurilmani qulflash va
                chiqish (logout) qilish sizning zimangizda.
              </p>
            </section>

            <section>
              <h2>5. GitHub shartlari va uchinchi tomon qoidalari</h2>
              <p>
                Xizmat GitHub platformasiga bog‘liq. Siz GitHub Terms of Service,
                Acceptable Use Policies, Privacy Statement va boshqa amaldagi
                qoidalariga rioya qilishingiz shart. Xizmat GitHubning rasmiy
                mahsuloti emas, GitHub tomonidan qo‘llab-quvvatlanmaydi va
                tasdiqlanmagan bo‘lishi mumkin.
              </p>
              <p>
                Agar GitHub sizning akkauntingizga cheklov qo‘ysa, commitlarni
                contribution sifatida hisoblamasa, reponi o‘chirse yoki OAuth
                ruxsatini bekor qilsa, biz buning uchun javobgar emasmiz.
                Platforma qoidalarining o‘zgarishi Xizmat funksiyalariga ta’sir
                qilishi mumkin.
              </p>
              <p>
                Foydalanuvchi GitHub qoidalarini buzgan holda (masalan,
                aldov, spam, taqiqlangan kontent, boshqa foydalanuvchilar
                huquqlarini buzish) Xizmatdan foydalanishi taqiqlanadi.
                Bunday holatda biz kirishni cheklash yoki ma’lumotlarni
                o‘chirish huquqini saqlaymiz.
              </p>
            </section>

            <section>
              <h2>6. Commitlar, fork, push va pull request</h2>
              <p>
                «Commit qilish» amali odatda quyidagi bosqichlarni o‘z ichiga
                oladi (texnik tafsilotlar o‘zgarishi mumkin):
              </p>
              <ol>
                <li>
                  Agar mavjud bo‘lmasa, upstream <code>githubchi</code>{" "}
                  omboridan Foydalanuvchi akkauntiga fork yaratish;
                </li>
                <li>
                  Lokal ish maydoniga clone yoki mavjud cloneni yangilash;
                </li>
                <li>
                  Tanlangan yil va pattern bo‘yicha sanalangan commitlar
                  yaratish (odatda <code>contributions/</code> ostidagi log
                  faylga yozish orqali);
                </li>
                <li>
                  O‘zgarishlarni <code>main</code> branchga push qilish;
                </li>
                <li>
                  Upstreamga pull request ochish yoki ochiq PRni qayta
                  ishlatish.
                </li>
              </ol>
              <p>
                Commitlarning muallifligi sizning GitHub profilingiz / email
                attributsiyangizga bog‘liq bo‘lishi mumkin. Noto‘g‘ri email,
                noreply sozlamalari yoki GitHub privacy sozlamalari graph
                natijasiga ta’sir qilishi mumkin — buni tekshirish
                Foydalanuvchi zimmasida.
              </p>
              <p>
                Xizmat sizning boshqa shaxsiy yoki ishchi reposingizga ixtiyoriy
                yozmasligi kerak; asosiy maqsad — <code>githubchi</code>{" "}
                nomli maxsus repo. Shunga qaramay, OAuth ruxsatlari doirasida
                texnik xato yoki noto‘g‘ri konfiguratsiya xavfi nolga teng emas.
                Muhim reposingizni himoya qilish, branch himoyasi va access
                token scope’larini kuzatish tavsiya etiladi.
              </p>
            </section>

            <section>
              <h2>7. Patternlar, limitlar va preview</h2>
              <p>
                Xizmat turli patternlarni (masalan, shuffle, text, employeer,
                hobbichi) taklif qilishi mumkin. Preview ekranda ko‘rsatilgan
                xarita taxminiy ko‘rinish hisoblanadi; server tomonda commit
                jarayonida map qayta hisoblanishi mumkin. Seed / random
                oqibatida bir xil sozlamalar ham farqli natija berishi mumkin.
              </p>
              <p>Quyidagi cheklovlar amal qilishi mumkin (o‘zgarishi mumkin):</p>
              <ul>
                <li>bitta harakatda commitlar soni bo‘yicha yuqori chegara (masalan, 2000);</li>
                <li>kelajak sanalarga commit yaratilmasligi;</li>
                <li>text pattern uchun matn uzunligi cheklovi;</li>
                <li>oylar tanlanishi majburiy bo‘lgan patternlar.</li>
              </ul>
              <p>
                Siz tanlagan matn, pattern va konfiguratsiya uchun o‘zingiz
                javobgarasiz. Haqoratli, noqonuniy, uchinchi shaxs huquqlarini
                buzadigan yoki aldovchi matnlarni joylashtirish taqiqlanadi.
              </p>
            </section>

            <section>
              <h2>8. Bekor qilish, o‘chirish va force-push</h2>
              <p>
                «O‘chirish» / bekor qilish funksiyasi odatda harakat
                boshlanguncha saqlangan <code>before_sha</code> holatiga{" "}
                <code>git reset --hard</code> va keyin{" "}
                <code>git push --force</code> orqali amalga oshiriladi. Bu
                operatsiya:
              </p>
              <ul>
                <li>
                  <code>githubchi</code> repo tarixini qayta yozishi mumkin;
                </li>
                <li>
                  boshqa qurilmalardagi lokal clonelar bilan ziddiyat
                  keltirishi mumkin;
                </li>
                <li>
                  agar shu branchga qo‘lda qo‘shimcha commitlar qilingan
                  bo‘lsa, ularni yo‘qotishi mumkin;
                </li>
                <li>
                  GitHub graphidagi yashil nuqtalarni darhol yoki umuman olib
                  tashlamasligi mumkin.
                </li>
              </ul>
              <p>
                Force-push xavfini tushungan holda tasdiqlaysiz. Xizmat
                «faqat completed» holatdagi harakatlarni bekor qilishni
                cheklashi mumkin. <code>before_sha</code> yo‘q bo‘lsa, revert
                imkonsiz bo‘lishi mumkin.
              </p>
            </section>

            <section>
              <h2>9. Ma’lumotlar, maxfiylik va saqlash</h2>
              <p>
                Xizmat funksiyani bajarish uchun quyidagi ma’lumotlarni qayta
                ishlashi mumkin: GitHub identifikatorlari, profil
                ma’lumotlari, access token, harakat konfiguratsiyasi, preview
                xaritasi, commit metama’lumotlari, xato jurnallari, IP/texnik
                loglar (infratuzilma darajasida).
              </p>
              <p>
                Access token maxfiy hisoblanadi. Biz uni faqat Xizmat
                maqsadlari uchun ishlatishga intilamiz, biroq hech qanday
                tizim 100% xavfsizlikni kafolatlamaydi. Server, ma’lumotlar
                bazasi yoki uzatish kanallaridagi buzilish xavfi mavjud.
                Tokenni vaqti-vaqti bilan GitHubda aylantirish (rotate) va
                keraksiz ruxsatlarni olib tashlash tavsiya etiladi.
              </p>
              <p>
                Brauzerda API JWT (masalan, <code>localStorage</code>)
                saqlanishi mumkin. Umumiy qurilmalarda foydalangandan keyin
                chiqishni unutmang.
              </p>
              <p>
                Biz ma’lumotlarni Xizmatni ko‘rsatish, xavfsizlik, suiiste’molni
                oldini olish, texnik tahlil va qonuniy talablarni bajarish
                uchun saqlashimiz mumkin. Saqlash muddati operatsion ehtiyojga
                qarab belgilanadi. Alohida Maxfiylik siyosati e’lon qilingan
                bo‘lsa, u ushbu bo‘limni to‘ldiradi.
              </p>
            </section>

            <section>
              <h2>10. Taqiqlangan foydalanish</h2>
              <p>Sizga quyidagilar taqiqlanadi:</p>
              <ul>
                <li>
                  Xizmatni noqonuniy maqsadlarda, firibgarlikda yoki uchinchi
                  shaxslarni aldashda ishlatish;
                </li>
                <li>
                  boshqa shaxsning GitHub akkaunti yoki ruxsatisiz uning
                  nomidan harakat qilish;
                </li>
                <li>
                  Xizmatni, APIni yoki infratuzilmani buzishga urinish
                  (skanerlash, overload, exploit, reverse-engineering orqali
                  zarar yetkazish);
                </li>
                <li>
                  avtomatlashtirilgan mass-so‘rovlar, spam yoki adolatsiz
                  resurs sarfi;
                </li>
                <li>
                  zararli kod, taqiqlangan kontent yoki litsenziyani buzuvchi
                  material joylash;
                </li>
                <li>
                  Xizmatni qayta sotish, «white-label» qilib taqdim etish yoki
                  bizning brendimizni chalkashtiruvchi tarzda ishlatish
                  (alohida yozma ruxsatsiz);
                </li>
                <li>
                  bolalar yoki huquqiy layoqatsiz shaxslar uchun qonun
                  talablarini buzgan holda foydalanish.
                </li>
              </ul>
              <p>
                Taqiqni buzish hisobni bloklash, ma’lumotlarni o‘chirish va
                zarur hollarda huquqni muhofaza qilish organlariga murojaat
                qilish uchun asos bo‘lishi mumkin.
              </p>
            </section>

            <section>
              <h2>11. Intellektual mulk</h2>
              <p>
                Xizmatning dasturiy kodi, dizayni, matnlari, logotipi va
                brendi (qonun bilan himoyalangan qismlari) tegishli
                huquq egalariga tegishli. Shartlar sizga Xizmatdan shaxsiy,
                no-eksklyuziv, o‘tkazib bo‘lmaydigan foydalanish huquqini
                beradi — faqat Shartlarga muvofiq.
              </p>
              <p>
                Sizning GitHub repongizdagi commitlaringiz va shaxsiy
                kontentingiz odatda sizga (yoki tegishli huquq egasiga)
                tegishli bo‘lib qoladi. Upstream ombor va undagi materiallar
                o‘z litsenziyasiga bo‘ysunadi; fork qilish va PR ochish shu
                litsenziya va GitHub qoidalariga mos kelishi kerak.
              </p>
            </section>

            <section>
              <h2>12. Javobgarlikni cheklash</h2>
              <p>
                Qonun ruxsat bergan maksimal darajada, Xizmat egasi, operatorlari,
                hissa qo‘shuvchilar va bog‘liq shaxslar quyidagilar uchun
                javobgar emas:
              </p>
              <ul>
                <li>
                  bilvosita, tasodifiy, maxsus, jazoviy yoki oqibatli
                  zararlar;
                </li>
                <li>
                  foyda, ma’lumot, reputatsiya, biznes imkoniyati yo‘qotilishi;
                </li>
                <li>
                  GitHub akkauntining cheklanishi, ban qilinishi yoki
                  contribution graphining kutilganidek o‘zgarmasligi;
                </li>
                <li>
                  force-push yoki commitlar oqibatida yo‘qolgan ish;
                </li>
                <li>
                  uchinchi tomon xizmatlari (GitHub, hosting, DNS, brauzer)
                  nosozliklari;
                </li>
                <li>
                  Foydalanuvchi yoki uchinchi shaxslarning harakatlari.
                </li>
              </ul>
              <p>
                Jami javobgarlik (agar qonun umuman cheklashga yo‘l qo‘ysa)
                Siz Xizmat uchun so‘nggi uch oyda to‘lagan summa bilan
                cheklanadi; Xizmat bepul bo‘lsa — nolga teng deb hisoblanishi
                mumkin, qonun majburiy himoya qiladigan hollar bundan
                mustasno.
              </p>
              <p>
                Ayrim yurisdiksiyalar ayrim kafolatlarni istisno qilishni
                cheklaydi. Bunday hollarda faqat majburiy qoidalar amal
                qiladi, qolgan cheklovlar maksimal darajada saqlanadi.
              </p>
            </section>

            <section>
              <h2>13. Zararni qoplash (indemnifikatsiya)</h2>
              <p>
                Siz Xizmatdan foydalanishingiz, Shartlarni buzishingiz, GitHub
                yoki uchinchi shaxs huquqlarini buzishingiz, yoki
                kontentingiz/commitlaringiz oqibatida kelib chiqqan da’vo,
                zarar, jarima va xarajatlar (shu jumladan oqilona yuridik
                xarajatlar) dan bizni himoya qilishga va zararni qoplashga
                rozilik bildirasiz.
              </p>
            </section>

            <section>
              <h2>14. Xizmatning o‘zgarishi, to‘xtatilishi va bekor qilish</h2>
              <p>
                Biz istalgan vaqtda, oldindan ogohlantirishsiz yoki
                ogohlantirish bilan: funksiyalarni o‘zgartirish, cheklash,
                texnik ishlarni e’lon qilish, xizmatni vaqtincha yoki butunlay
                to‘xtatish huquqini saqlaymiz. Bepul xizmat uchun bu
                o‘zgarishlar kompensatsiya talab qilmaydi.
              </p>
              <p>
                Siz istalgan paytda foydalanishni to‘xtatishingiz, chiqishingiz
                va GitHub OAuth ruxsatini bekor qilishingiz mumkin. Biz
                Shartlarni buzgan yoki xavf tug‘dirgan akkauntlarga kirishni
                cheklashimiz mumkin.
              </p>
            </section>

            <section>
              <h2>15. Yosh cheklovi</h2>
              <p>
                Xizmatdan foydalanish uchun Siz o‘z yurisdiksiyangizda shartnoma
                tuzish huquqiga ega bo‘lishingiz kerak. Agar siz voyaga
                yetmagan bo‘lsangiz, faqat qonuniy vakil roziligi bilan
                foydalaning. GitHub o‘z yosh talablariga ega — ularga ham rioya
                qiling.
              </p>
            </section>

            <section>
              <h2>16. Eksport, avtomatlashtirish va API</h2>
              <p>
                Agar ochiq API yoki SSE oqimlari mavjud bo‘lsa, ular faqat
                rasmiy UI va ruxsat etilgan mijozlar uchun mo‘ljallangan
                bo‘lishi mumkin. Skreyping, tokenlarni ulashish, rate limitni
                aylanib o‘tish yoki xizmatni boshqa tijorat mahsulotiga
                ulash — alohida kelishuvsiz taqiqlanadi.
              </p>
            </section>

            <section>
              <h2>17. Bildirishnomalar va aloqa</h2>
              <p>
                Xizmat bo‘yicha e’lonlar asosan interfeys, ushbu sahifa yoki
                loyiha bilan bog‘liq ombor/sayt orqali berilishi mumkin.
                Rasmiy domen: <strong>githubchi.uz</strong> (yoki operator
                e’lon qilgan boshqa manzil).
              </p>
            </section>

            <section>
              <h2>18. Ajratib bo‘lishlik va butun kelishuv</h2>
              <p>
                Agar Shartlarning biror bandi sud yoki vakolatli organ
                tomonidan haqiqiy emas deb topilsa, qolgan bandlar o‘z
                kuchida qoladi. Ushbu Shartlar (va e’lon qilingan qo‘shimcha
                siyosatlar) mavzu yuzasidan tomonlar o‘rtasidagi butun
                kelishuvni tashkil etadi va oldingi og‘zaki yoki yozma
                kelishuvlarni (agar bo‘lsa) almashtiradi.
              </p>
            </section>

            <section>
              <h2>19. Amaldagi qonun va nizolar</h2>
              <p>
                Agar alohida yozma kelishuvda boshqacha ko‘rsatilmagan bo‘lsa,
                Shartlarga O‘zbekiston Respublikasi qonunlari qo‘llanilishi
                mumkin (majburiy iste’molchi huquqlari saqlanib qolgan holda).
                Nizolar avvalo muzokara yo‘li bilan hal etilishiga harakat
                qilinadi. Kelishuvga erishilmasa, nizolar vakolatli sudlarda
                ko‘rib chiqiladi.
              </p>
              <p>
                Ba’zi iste’molchi huquqlari shartnoma bilan cheklanmaydi. Agar
                sizning yurisdiksiyangizda majburiy himoya mavjud bo‘lsa, u
                ustunlik qiladi.
              </p>
            </section>

            <section>
              <h2>20. Maxsus ogohlantirish — «yashil nuqtalar» haqida</h2>
              <p>
                GitHub contribution graph ko‘pchilik uchun shaxsiy brend va
                professional obro‘ning bir qismi hisoblanadi. Sun’iy
                naqshlar:
              </p>
              <ul>
                <li>
                  ish beruvchi, mijoz yoki hamjamiyat tomonidan salbiy
                  baholanishi;
                </li>
                <li>
                  platforma qoidalariga zid deb topilishi;
                </li>
                <li>
                  texnik jihatdan qaytarib bo‘lmaydigan yoki qisman qaytariladigan
                  oqibatlarga olib kelishi mumkin.
                </li>
              </ul>
              <p>
                Xizmatdan foydalanishdan oldin oqibatlarni o‘ylab ko‘ring.
                «Commit qilish» tugmasini bosish — siz ushbu ogohlantirishni
                qabul qilganingizni bildiradi.
              </p>
            </section>

            <section>
              <h2>21. Yakuniy qoidalar</h2>
              <p>
                Ushbu Shartlar o‘zbek tilida taqdim etilgan. Agar boshqa tilga
                tarjima qilinsa va ziddiyat chiqsa, operator belgilagan asosiy
                til versiyasi ustunlik qilishi mumkin.
              </p>
              <p>
                Savollar bo‘yicha Xizmat operatori bilan loyihaning rasmiy
                kanallari orqali bog‘lanishingiz mumkin. Javob berish muddati
                kafolatlanmaydi.
              </p>
              <p className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-[var(--fg-muted)]">
                Xizmatdan foydalanish orqali Siz yuqoridagi barcha bandlarni,
                xususan GitHub tokenining saqlanishi, sanalangan commitlar,
                force-push xavfi, contribution graph kafolatlanmasligi va
                javobgarlikni cheklash haqidagi bandlarni qabul qilasiz.
              </p>
            </section>
          </div>

          <div className="mt-10 flex flex-wrap gap-4 border-t border-[var(--border)] pt-6 text-sm">
            <Link href="/login" className="text-[var(--accent)] hover:underline">
              ← Kirish sahifasi
            </Link>
            <Link href="/" className="text-[var(--accent)] hover:underline">
              Bosh sahifa
            </Link>
          </div>
        </article>
      </main>

      <footer className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--fg-muted)]">
        githubchi · yashil nuqtalar
      </footer>
    </div>
  );
}
