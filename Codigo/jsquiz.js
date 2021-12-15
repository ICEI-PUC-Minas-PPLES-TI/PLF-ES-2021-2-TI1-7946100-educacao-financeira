(function() {
  var questions = [{
    question: "Qual é o resultado do trabalho?",
    choices: ['Consumo', 'Capital', 'Produção', 'Força'],
    correctAnswer: 3
  }, {
    question: "O que são fatores de produção?",
    choices: ['Terra, capital e força', 'Terra, capital e consumo', 'Terra, capital e trabalho', 'Terra, trabalho e consumo'],
    correctAnswer: 3
  }, {
    question: "Qual é o ato de comprar de forma exagerada?",
    choices: ['Economia', 'Socialismo', 'Consumismo', 'Educação'],
    correctAnswer: 3
  }, {
    question: "O que é consumo inteligente?",
    choices: ['É a ação de usar bens e serviços', 'É transformar o ato de consumir numa prática permanente de construção da cidadania', 'É o que considera como necessidade de reais, os desejos e condições financeiras, econômicos obter a maior satisfação possível ao menor custo', 'É comprar de forma exagerada'],
    correctAnswer: 3
  }, {
    question: "Qual é o conceito relacionado à abundância?",
    choices: ['Poupar', 'Riqueza', 'Economia', 'Crédito'],
    correctAnswer: 2
  }, {
    question: "Qual a cobrada pelo empréstimo de dinheiro?",
    choices: ['Crédito', 'Juros', 'Poupança', 'Riqueza'],
    correctAnswer: 2
  }, {
    question: "Qual o tipo de aposto direcionado para a administração das finanças, seja de uma pessoa, de uma família ou de uma atividade produtiva?",
    choices: ['Financeiro', 'Educativo', 'Econômico', 'Popular'],
    correctAnswer: 1
  }, {
    question: "Tudo que recebemos ou ganhamos é chamado de?",
    choices: ['Despesa', 'Receita'],
    correctAnswer: 2
 }, {
    question: "Tudo o que se gasta ou perde é chamado de?",
    choices: ['Despesa', 'Receita'],
    correctAnswer: 1
 }, {
    question: "O que é lucro?",
    choices: ['Quando as receitas são maiores que as despesas', 'Quando como receitas são iguais às despesas','Quando as receitas são menores que as despesas'],
    correctAnswer: 1
 }, {
    question: "O que é prejuízo?",
    choices: ['Quando as despesas são menores que as receitas', 'Quando as despesas são iguais como receitas','Quando as despesas são maiores que as receitas'],
    correctAnswer: 3
 }, {
    question: "O que é Educação Financeira?",
    choices: ['É o desenvolvimento de competências necessárias para se tornar um cidadão mais consciente das oportunidades e risco responsável e, então, poder fazer escolhas que melhorem o seu bem-estar', 'é o ato de gastar de maneira desordenada','É o ato de usar a gastar demais', 'É o processo de enriquecer gastando pouco e comendo muito e se divertindo demais'],
    correctAnswer: 1
  }];
  
  var questionCounter = 0; //Tracks question number
  var selections = []; //Array containing user choices
  var quiz = $('#quiz'); //Quiz div object
  
  // Display initial question
  displayNext();
  
  // Click handler for the 'next' button
  $('#next').on('click', function (e) {
    e.preventDefault();
    
    // Suspend click listener during fade animation
    if(quiz.is(':animated')) {        
      return false;
    }
    choose();
    
    // If no user selection, progress is stopped
    if (isNaN(selections[questionCounter])) {
      alert('Por favor selecione uma opção!');
    } else {
      questionCounter++;
      displayNext();
    }
  });
  
  // Click handler for the 'prev' button
  $('#prev').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }
    choose();
    questionCounter--;
    displayNext();
  });
  
  // Click handler for the 'Start Over' button
  $('#start').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }
    questionCounter = 0;
    selections = [];
    displayNext();
    $('#start').hide();
  });
  
  // Animates buttons on hover
  $('.button').on('mouseenter', function () {
    $(this).addClass('active');
  });
  $('.button').on('mouseleave', function () {
    $(this).removeClass('active');
  });
  
  // Creates and returns the div that contains the questions and 
  // the answer selections
  function createQuestionElement(index) {
    var qElement = $('<div>', {
      id: 'question'
    });
    
    var header = $('<h2>Questão ' + (index + 1) + ':</h2>');
    qElement.append(header);
    
    var question = $('<p>').append(questions[index].question);
    qElement.append(question);
    
    var radioButtons = createRadios(index);
    qElement.append(radioButtons);
    
    return qElement;
  }
  
  // Creates a list of the answer choices as radio inputs
  function createRadios(index) {
    var radioList = $('<ul>');
    var item;
    var input = '';
    for (var i = 0; i < questions[index].choices.length; i++) {
      item = $('<li>');
      input = '<input type="radio" name="answer" value=' + i + ' />';
      input += questions[index].choices[i];
      item.append(input);
      radioList.append(item);
    }
    return radioList;
  }
  
  // Reads the user selection and pushes the value to an array
  function choose() {
    selections[questionCounter] = +$('input[name="answer"]:checked').val();
  }
  
  // Displays next requested element
  function displayNext() {
    quiz.fadeOut(function() {
      $('#question').remove();
      
      if(questionCounter < questions.length){
        var nextQuestion = createQuestionElement(questionCounter);
        quiz.append(nextQuestion).fadeIn();
        if (!(isNaN(selections[questionCounter]))) {
          $('input[value='+selections[questionCounter]+']').prop('checked', true);
        }
        
        // Controls display of 'prev' button
        if(questionCounter === 1){
          $('#prev').show();
        } else if(questionCounter === 0){
          
          $('#prev').hide();
          $('#next').show();
        }
      }else {
        var scoreElem = displayScore();
        quiz.append(scoreElem).fadeIn();
        $('#next').hide();
        $('#prev').hide();
        $('#start').show();
      }
    });
  }
  
  // Computes score and returns a paragraph element to be displayed
  function displayScore() {
    var score = $('<p>',{id: 'question'});
    
    var numCorrect = 0;
    for (var i = 0; i < selections.length; i++) {
      if (selections[i] === questions[i].correctAnswer) {
        numCorrect++;
      }
    }
    
    score.append('Você acertou ' + numCorrect + ' questões de ' +
                 questions.length + ' !');
    return score;
  }
})();