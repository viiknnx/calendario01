document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do DOM
    const monthYearDisplay = document.getElementById('current-month-year');
    const daysContainer = document.getElementById('days-container');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    // Estado do calendário
    let currentDate = new Date(); // Data atual (para referência do mês)
    let selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 10); // Dia "10" selecionado (exemplo)

    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    /**
     * Renderiza o calendário para o mês e ano atuais em 'currentDate'.
     */
    function renderCalendar() {
        // 1. Atualiza o cabeçalho
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        monthYearDisplay.textContent = `${months[currentMonth]} ${currentYear}`;
        daysContainer.innerHTML = ''; // Limpa os dias anteriores

        // 2. Calcula datas
        // O primeiro dia do mês (0: Domingo, 1: Segunda, ..., 6: Sábado)
        // Usamos 0 para o dia para obter o dia da semana do dia anterior (último dia do mês anterior)
        // O método getDay() retorna 0 para Domingo e 6 para Sábado. Queremos a Segunda como 0.
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        // A quantidade de dias no mês
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        // A quantidade de dias do mês anterior para preencher o início
        const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        // Número de "células vazias" ou dias do mês anterior que precisam ser exibidos
        // O 0 é Domingo, 1 é Segunda. Nosso calendário começa em Segunda (Mo).
        // Se o mês começar em Domingo (0), precisa de 6 dias vazios (Su, Mo, Tu, We, Th, Fr)
        // Se o mês começar em Segunda (1), precisa de 0 dias vazios
        // Se o mês começar em Quarta (3), precisa de 2 dias vazios (Mo, Tu)
        const startDayIndex = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; 


        // 3. Adiciona dias do mês anterior (preenchimento inicial)
        for (let i = startDayIndex; i > 0; i--) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('prev-date');
            dayDiv.textContent = lastDayOfPrevMonth - i + 1;
            daysContainer.appendChild(dayDiv);
        }

        // 4. Adiciona dias do mês atual
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = i;
            
            // Verifica se este dia é o dia selecionado (exemplo: dia 10)
            const isSelectedMonth = (currentYear === selectedDate.getFullYear() && currentMonth === selectedDate.getMonth());
            const isSelectedDay = isSelectedMonth && (i === selectedDate.getDate());
            
            if (isSelectedDay) {
                dayDiv.classList.add('selected-day');
            }

            // Opcional: Adicionar evento de clique para selecionar um novo dia
            dayDiv.addEventListener('click', () => {
                // Remove o destaque do dia anterior, se houver
                const oldSelected = daysContainer.querySelector('.selected-day');
                if (oldSelected) {
                    oldSelected.classList.remove('selected-day');
                }
                
                // Define a nova data selecionada
                selectedDate = new Date(currentYear, currentMonth, i);
                
                // Adiciona o destaque ao novo dia
                dayDiv.classList.add('selected-day');
                
                console.log(`Nova data selecionada: ${selectedDate.toDateString()}`);
            });

            daysContainer.appendChild(dayDiv);
        }

        // 5. Adiciona dias do próximo mês (preenchimento final)
        const totalDaysRendered = daysContainer.children.length;
        // O calendário precisa de 6 linhas * 7 dias = 42 células no máximo.
        // Se já tiver mais de 35 (5 linhas), precisa preencher até 42.
        const remainingDays = 42 - totalDaysRendered;
        
        for (let i = 1; i <= remainingDays && totalDaysRendered + i <= 42; i++) {
            const dayDiv = document.createElement('div');
            // Podemos usar a classe 'empty' para células que não são dias válidos, 
            // mas aqui usaremos 'next-date' para mostrar o início do próximo mês.
            dayDiv.classList.add('next-date');
            dayDiv.textContent = i;
            daysContainer.appendChild(dayDiv);

            // Se atingir 6 linhas completas (42 dias), para
            if (daysContainer.children.length % 7 === 0 && daysContainer.children.length >= 35) {
                if (daysContainer.children.length === 42) break; // Máximo de 6 semanas
            }
        }
    }

    // --- Funções de Navegação ---

    prevMonthBtn.addEventListener('click', () => {
        // Volta um mês. O índice de mês de Date vai de 0 a 11 e cuida da mudança de ano automaticamente.
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        // Avança um mês.
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Inicializa o calendário com o mês atual ou o mês da 'selectedDate' inicial
    currentDate.setMonth(selectedDate.getMonth()); // Garante que começa no mês da data que queremos destacar (Fevereiro 2022 no seu caso)
    currentDate.setFullYear(selectedDate.getFullYear());
    renderCalendar();
});
