"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProfileTests.module.css";
import { useTranslation } from "@/contexts/TranslationProvider.jsx";

const ProfileTests = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  // Функція для отримання перекладеного питання
  const getTranslatedQuestion = (questionId) => {
    return t(`question${questionId}`) || questions.find(q => q.id === questionId)?.question || "";
  };

  // Функція для отримання перекладених варіантів відповідей
  const getTranslatedOptions = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return [];
    
    return question.options.map((option, index) => ({
      ...option,
      text: t(`q${questionId}_option${index + 1}`) || option.text
    }));
  };

  const questions = [
    {
      id: 1,
      question: "Якби ви опинилися в незнайомому місті без інтернету, як би знайшли потрібну адресу?",
      options: [
        { text: "Зверну увагу на нумерацію будинків та логіку планування вулиць", type: "math" },
        { text: "Спитаю в перехожих, спробую зрозуміти місцеві особливості мови", type: "philology" },
        { text: "Подивлюся на архітектуру та стиль будівель, щоб зрозуміти район", type: "history" },
        { text: "Знайду найближчий торговий центр або транспортний вузол", type: "biology" }
      ]
    },
    {
      id: 2,
      question: "Оберіть ситуацію, в якій ви б найкраще розкрили свій потенціал:",
      options: [
        { text: "Розв'язувати складні головоломки та знаходити несподівані рішення", type: "math" },
        { text: "Спілкуватися з людьми та впливати на їхні емоції", type: "philology" },
        { text: "Розбиратися в тому, що насправді стоїть за подіями", type: "history" },
        { text: "Планувати проекти та втілювати їх у життя", type: "biology" }
      ]
    },
    {
      id: 3,
      question: "Якби ви збирали колекцію, що б це було?",
      options: [
        { text: "Механічні головоломки або предмети з цікавою конструкцією", type: "math" },
        { text: "Старі листівки або книги з різних країн", type: "philology" },
        { text: "Монети або предмети, що розповідають історії епох", type: "history" },
        { text: "Речі, які можуть стати цінними або корисними в майбутньому", type: "biology" }
      ]
    },
    {
      id: 4,
      question: "Ваша улюблена частина в командних іграх?",
      options: [
        { text: "Розробляти стратегію та передбачати ходи суперника", type: "math" },
        { text: "Придумувати креативні назви та легенди для команди", type: "philology" },
        { text: "Вивчати правила та їх походження, історію гри", type: "history" },
        { text: "Аналізувати сильні сторони гравців та розподіляти ролі", type: "biology" }
      ]
    },
    {
      id: 5,
      question: "Коли ви дивитеся фільм, на що звертаете найбільше уваги?",
      options: [
        { text: "На деталі, які можуть стати ключами до розгадки сюжету", type: "math" },
        { text: "На діалоги, акценти акторів та особливості перекладу", type: "philology" },
        { text: "На історичну достовірність та контекст подій", type: "history" },
        { text: "На те, наскільки реалістично показані відносини та мотивації", type: "biology" }
      ]
    },
    {
      id: 6,
      question: "В якій ситуації ти почуваєшся найкомфортніше?",
      options: [
        { text: "Коли можу сконцентруватися та працювати в тиші", type: "math" },
        { text: "Коли навколо багато людей та активного спілкування", type: "philology" },
        { text: "Коли є час поміркувати та дослідити питання глибше", type: "history" },
        { text: "Коли можу швидко приймати рішення та бачити результат", type: "biology" }
      ]
    },
    {
      id: 7,
      question: "Уяви, що потрібно представити себе перед класом. Як ти це зробиш?",
      options: [
        { text: "Підготую чітку структуру та буду говорити по пунктах", type: "math" },
        { text: "Розкажу цікаву історію, щоб привернути увагу", type: "philology" },
        { text: "Поділюся тим, що мене справді хвилює та цікавить", type: "history" },
        { text: "Покажу конкретні приклади того, що вмію робити", type: "biology" }
      ]
    },
    {
      id: 8,
      question: "Ваш стиль подарунків для друзів:",
      options: [
        { text: "Щось незвичайне, що змусить задуматися або поекспериментувати", type: "math" },
        { text: "Те, що розширить кругозір або додасть нових вражень", type: "philology" },
        { text: "Щось, що має глибоке значення або цікаву історію", type: "history" },
        { text: "Практична річ, якою людина точно скористається", type: "biology" }
      ]
    },
    {
      id: 9,
      question: "Яку роль ти частіше виконуєш у груповій роботі?",
      options: [
        { text: "Слідкую за якістю та помічаю помилки", type: "math" },
        { text: "Генерую ідеї та надихаю інших", type: "philology" },
        { text: "Збираю та систематизую всю необхідну інформацію", type: "history" },
        { text: "Налагоджую стосунки між учасниками команди", type: "biology" }
      ]
    },
    {
      id: 10,
      question: "Якби ви могли змінити одну річ у школі, що б це було?",
      options: [
        { text: "Більше експериментів та можливостей перевірити теорію на практиці", type: "math" },
        { text: "Більше дискусій та обміну думками між учнями", type: "philology" },
        { text: "Більше міжпредметних зв'язків та комплексного розуміння", type: "history" },
        { text: "Більше проектів, результати яких можна побачити і застосувати", type: "biology" }
      ]
    }
  ];

  const specializations = {
    math: {
      name: "Математичний напрямок",
      description: "Ви маєте схильність до точних наук, логічного мислення та структурованого підходу до вирішення задач. Математика, алгебра, геометрія та аналітичні дисципліни - це ваша стихія.",
      subjects: ["Математика", "Алгебра", "Геометрія", "Статистика", "Інформатика"],
      characteristics: [
        "Логічне мислення",
        "Уважність до деталей", 
        "Системний підхід",
        "Аналітичні здібності",
        "Точність у роботі"
      ],
      emoji: "📊"
    },
    physics: {
      name: "Фізико-математичний напрямок", 
      description: "Вас приваблюють фундаментальні закони природи, експерименти та дослідження. Ви здатні мислити абстрактно та розуміти складні фізичні процеси.",
      subjects: ["Фізика", "Математика", "Астрономія", "Інформатика", "Хімія"],
      characteristics: [
        "Абстрактне мислення",
        "Дослідницькі здібності",
        "Математична інтуїція",
        "Логічне мислення",
        "Цікавість до природи"
      ],
      emoji: "🔬"
    },
    biology: {
      name: "Хіміко-біологічний напрямок",
      description: "Вас цікавить живий світ, хімічні процеси та медицина. Ви готові досліджувати природу на молекулярному рівні та розуміти механізми життя.",
      subjects: ["Біологія", "Хімія", "Екологія", "Анатомія", "Фізіологія"],
      characteristics: [
        "Спостережливість",
        "Цікавість до природи",
        "Аналітичне мислення",
        "Терпіння в дослідженнях",
        "Системний підхід"
      ],
      emoji: "🧬"
    },
    history: {
      name: "Історичний профіль",
      description: "Ви цінуєте минуле, розумієте зв'язки між подіями та можете аналізувати суспільні процеси. Історія, культура та політика - ваші сильні сторони.",
      subjects: ["Історія", "Суспільствознавство", "Культурологія", "Правознавство", "Географія"],
      characteristics: [
        "Аналітичне мислення",
        "Цікавість до минулого",
        "Критичне мислення",
        "Дослідницькі здібності",
        "Системний підхід"
      ],
      emoji: "📜"
    },
    philology: {
      name: "Іноземна філологія",
      description: "Ви маєте потужний мовний інтелект, любите іноземні мови та міжкультурну комунікацію. Мови, література та комунікації - це ваша сфера.",
      subjects: ["Англійська мова", "Німецька мова", "Зарубіжна література", "Мовознавство", "Культурологія"],
      characteristics: [
        "Мовні здібності",
        "Комунікативні навички",
        "Креативність",
        "Цікавість до культур",
        "Аналітичне мислення"
      ],
      emoji: "📚"
    },
    ukrphilology: {
      name: "Українська філологія",
      description: "Ви маєте глибоке розуміння рідної мови, цікавитесь українською літературою та культурою. Українська мова та література - ваше покликання.",
      subjects: ["Українська мова", "Українська література", "Історія України", "Культурологія", "Мовознавство"],
      characteristics: [
        "Мовні здібності",
        "Літературний смак",
        "Креативність",
        "Патріотизм",
        "Аналітичне мислення"
      ],
      emoji: "📖"
    }
  };

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = questions[currentQuestion].options[optionIndex].type;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (userAnswers) => {
    const scores = {};
    
    userAnswers.forEach(answer => {
      scores[answer] = (scores[answer] || 0) + 1;
    });

    // Знаходимо найбільший бал
    const maxScore = Math.max(...Object.values(scores));
    const topSpecializations = Object.keys(scores).filter(key => scores[key] === maxScore);
    
    let finalResult;
    
    // Якщо є кілька напрямків з однаковим балом, вибираємо за логікою
    if (topSpecializations.length > 1) {
      // Якщо є math та інші, перевіряємо чи є physics-орієнтовані відповіді
      if (topSpecializations.includes('math')) {
        // Перевіряємо, чи є відповіді, що вказують на фізику (експерименти, дослідження)
        const physicsIndicators = userAnswers.filter((answer, index) => 
          answer === 'math' && (
            index === 1 || // питання 2 про потенціал
            index === 4 || // питання 5 про фільми
            index === 9    // питання 10 про експерименти
          )
        ).length;
        
        if (physicsIndicators >= 2) {
          finalResult = 'physics';
        } else {
          finalResult = 'math';
        }
      } 
      // Якщо є philology та інші, перевіряємо чи є ukrphilology-орієнтовані відповіді
      else if (topSpecializations.includes('philology')) {
        // Перевіряємо, чи є відповіді, що вказують на українську філологію (культура, історія)
        const ukrPhilologyIndicators = userAnswers.filter((answer, index) => 
          answer === 'philology' && (
            index === 2 || // питання 3 про колекцію (книги з різних країн)
            index === 5 || // питання 6 про комфорт (спілкування)
            index === 7    // питання 8 про подарунки (розширення кругозору)
          )
        ).length;
        
        if (ukrPhilologyIndicators >= 2) {
          finalResult = 'ukrphilology';
        } else {
          finalResult = 'philology';
        }
      } else {
        // Якщо немає math або philology, вибираємо перший з найбільшим балом
        finalResult = topSpecializations[0];
      }
    } else {
      finalResult = topSpecializations[0];
    }

    // Перевіряємо, чи існує такий напрямок
    if (specializations[finalResult]) {
      setShowResult(finalResult);
    } else {
      console.error('Unknown specialization calculated:', finalResult);
      console.error('Available specializations:', Object.keys(specializations));
      console.error('User answers:', userAnswers);
      console.error('Scores:', scores);
      // Якщо щось пішло не так, показуємо помилку
      setShowResult('error');
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setTestStarted(false);
  };

  const startTest = () => {
    setTestStarted(true);
  };

  if (!testStarted) {
    return (
      <div className={styles.container}>
        <div className={styles.welcomeScreen}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>🎯 {t("profileTestsTitle")}</h1>
            <p className={styles.welcomeSubtitle}>
              {t("profileTestsSubtitle")}
            </p>
            
            <div className={styles.testInfo}>
              <div className={styles.infoBlock}>
                <span className={styles.infoIcon}>❓</span>
                <div>
                  <h3>{t("questionsCount")}</h3>
                  <p>{t("questionsCountSubtitle")}</p>
                </div>
              </div>
              
              <div className={styles.infoBlock}>
                <span className={styles.infoIcon}>⏱️</span>
                <div>
                  <h3>{t("timeToComplete")}</h3>
                  <p>{t("timeToCompleteSubtitle")}</p>
                </div>
              </div>
              
              <div className={styles.infoBlock}>
                <span className={styles.infoIcon}>🎓</span>
                <div>
                  <h3>{t("accurateRecommendation")}</h3>
                  <p>{t("accurateRecommendationSubtitle")}</p>
                </div>
              </div>
            </div>

            <div className={styles.directions}>
              <h3>{t("studyDirections")}</h3>
              <div className={styles.directionsList}>
                {Object.values(specializations).map((spec, index) => (
                  <span key={index} className={styles.directionTag}>
                    {spec.emoji} {t(`${Object.keys(specializations)[index]}Specialization`)}
                  </span>
                ))}
              </div>
            </div>

            <button className={styles.startButton} onClick={startTest}>
              {t("startTesting")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    // Перевіряємо, чи це помилка
    if (showResult === 'error') {
      return (
        <div className={styles.container}>
          <div className={styles.resultScreen}>
            <div className={styles.resultContent}>
              <h1>{t("error")}</h1>
              <p>{t("errorMessage")}</p>
              <button className={styles.retakeButton} onClick={resetTest}>
                {t("retakeTest")}
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    const result = specializations[showResult];
    
    // Перевіряємо, чи існує результат
    if (!result) {
      console.error('Unknown specialization:', showResult);
      return (
        <div className={styles.container}>
          <div className={styles.resultScreen}>
            <div className={styles.resultContent}>
              <h1>{t("error")}</h1>
              <p>{t("errorMessage")}</p>
              <button className={styles.retakeButton} onClick={resetTest}>
                {t("retakeTest")}
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className={styles.container}>
        <div className={styles.resultScreen}>
          <div className={styles.resultContent}>
            <div className={styles.resultHeader}>
              <span className={styles.resultEmoji}>{result.emoji}</span>
              <h1 className={styles.resultTitle}>{t("yourResult")}</h1>
              <h2 className={styles.resultName}>{t(`${showResult}Specialization`)}</h2>
            </div>

            <div className={styles.resultDescription}>
              <p>{t(`${showResult}Description`)}</p>
            </div>

            <div className={styles.resultCharacteristics}>
              <h3>{t("yourStrengths")}</h3>
              <div className={styles.characteristicsList}>
                {t(`${showResult}Characteristics`).map((characteristic, index) => (
                  <span key={index} className={styles.characteristicTag}>
                    {characteristic}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.resultSubjects}>
              <h3>{t("mainSubjects")}</h3>
              <div className={styles.subjectsList}>
                {t(`${showResult}Subjects`).map((subject, index) => (
                  <span key={index} className={styles.subjectTag}>
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.resultActions}>
              <button className={styles.retakeButton} onClick={resetTest}>
                {t("retakeTest")}
              </button>
              <button 
                className={styles.homeButton} 
                onClick={() => router.push('/')}
              >
                {t("returnToHome")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.testScreen}>
        <div className={styles.testHeader}>
          <div className={styles.progress}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>
              {currentQuestion + 1} {t("of")} {questions.length}
            </span>
          </div>
        </div>

        <div className={styles.questionContainer}>
          <h2 className={styles.questionTitle}>
            {getTranslatedQuestion(questions[currentQuestion].id)}
          </h2>

          <div className={styles.optionsContainer}>
            {getTranslatedOptions(questions[currentQuestion].id).map((option, index) => (
              <button
                key={index}
                className={styles.optionButton}
                onClick={() => handleAnswer(index)}
              >
                <span className={styles.optionLetter}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className={styles.optionText}>
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTests; 