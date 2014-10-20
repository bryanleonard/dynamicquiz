var Quiz = function(){

	var assetsTmpl = './assets/tmpl/'
		,qNum = 0
		,_this = this
		,allQuestions = [
			{
				question: "1. Who is Prime Minister of the United Kingdom?"
				,choices: ["David Cameron (Correct)", "Gordon Brown", "Winston Churchill", "Tony Blair"]
				,correctAnswer: 0
			}
			,{
				question: "2. Pick an answer (pick B)... Just trust me."
				,choices: ["Answer A", "Answer B (Correct)", "Answer C"]
				,correctAnswer: 1
			}
			,{
				question: "3. Will my house ever sell?"
				,choices: ["Probably.", "Probably Not. (Correct)", "If you're willing to give it away, it'll sell tomorrow."]
				,correctAnswer: 1
			}
			,{
				question: "4. Somewere out there..."
				,choices: ["Aliens exist.", "There\'s a guy plotting my demise.", "If love can see us through. (Correct)"]
				,correctAnswer: 2
			}
		]
	;

	// this.init = function() {
		// this.fetchTemplate(assetsTmpl + 'questions.hbs', allQuestions, 'quiz');
		// this.setEvents();
		// this.setPreviousBtn();

		// utils.vp();
	// }

	this.setEvents = function() {
		var _this = this;
		$('.container').on('click', '#nextBtn', function() {
			utils.showSpinner(this, '', false, false);
			_this.nextQuestion();
			utils.restoreOrigIcon(this);
		})
			.on('click', '#prevBtn', function() {
				utils.showSpinner(this, '', false, false);
				_this.prevQuestion();
				utils.restoreOrigIcon(this);
			});

		$('#summaryWrapper').on('click', '#againBtn', function() {
			_this.beginAgain();
		});
	}

	,this.fetchTemplate = function(tmpl, vals, dest) {
		var _this = this;

		$.ajax({
			url: tmpl,
			cache: false,
			timeout: 500,
			statusCode: {
				404: function() {
					$('#error').removeClass('hidden');
				}
			},
			success: function(data) {

				var source = data
					,template = Handlebars.compile(source)
					,context = vals
					,html = template(context)
				;

				_this.renderTemplate(html, dest);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#error').removeClass('hidden');
			}              
		});
	}

	,this.renderTemplate = function(html, dest) {
		var $wrapper = $("#" + dest + 'Wrapper')
			,$content = $("#" + dest)
		;

		$wrapper
			.hide()
			.removeClass('hidden');
		
		$content.html(html);

		for (var i = 0; i < allQuestions.length; i++) {
			if (i === +qNum) {
				$('#qNumber'+i).show();
			} else {
				$('#qNumber'+i).hide();
			};
		};

		$wrapper.fadeIn();
	}

	,this.isValid = function() {
		return $('input[name="group' + qNum + '"]:checked').length;
	}

	,this.nextQuestion = function() {
		if ( _this.isValid() ) {
			$('#validate').addClass('hidden');
		} else {
			$('#validate').hide().removeClass('hidden').fadeIn();
			return;
		};

		if (qNum < allQuestions.length-1) {
			qNum++;
			$('.questions').hide();
			$('#qNumber' + qNum).fadeIn();
			_this.setPreviousBtn();
		} else {
			qNum = 0;
			$('#quizWrapper').hide();
			_this.showSummary();
		};
	}

	,this.setPreviousBtn = function() {
		$('#prevBtn').prop('disabled', (qNum === 0));
	}

	,this.prevQuestion = function() {
		if (qNum < allQuestions.length-1 || qNum !== 0) {
			qNum--;
			$('.questions').hide();
			$('#qNumber' + qNum).fadeIn();
			_this.setPreviousBtn();
		};
	}

	,this.showSummary = function() {
		var summaryArry = []
			,theAnswers = this.getAnswers('qGroup')
			,totalCorrect = 0
			,percentage = 0
			,a
		;

		for (var i = 0, aql = allQuestions.length; i < aql; i++) {
			a = allQuestions[i];
			summaryArry.push(
				{ 
					 Q : a.question
					,A : a.choices[ a.correctAnswer ]
					,C : theAnswers[i]
				}
			);

			if(a.choices[ a.correctAnswer ] === theAnswers[i]) {
				totalCorrect++;
			};
		};

		this.fetchTemplate(assetsTmpl + 'summary.hbs', summaryArry, 'summary');

		percentage = Math.floor((totalCorrect/allQuestions.length) * 100);

		$('#percentCorrect').text(percentage);
		$('#numTotal').text(allQuestions.length);
		$('#numCorrect').text(totalCorrect);
	}

	,this.beginAgain = function() {
		qNum = 0;
		_this.setPreviousBtn();

		$('div[id$="Wrapper"]').hide();
		$('.quiz-items').empty();

		_this.fetchTemplate(assetsTmpl + 'questions.hbs', allQuestions, 'quiz');
	}

	,this.getAnswers = function() {
		var $answers = $('.questions input:checked')
			,answersArry = []
		;

		for (var i = 0, al = $answers.length; i < al; i++) {
			 answersArry.push($answers[i].value);
		};

		return answersArry;
	}

	this.fetchTemplate(assetsTmpl + 'questions.hbs', allQuestions, 'quiz');
	this.setEvents();
	this.setPreviousBtn();

	utils.vp();
	
};



// $(function() {
// 	var dQuiz = new Quiz;
// 	dQuiz.init();

	Handlebars.registerHelper('getOuterIndex', function(value){
	    this.outerIndex = Number(value);
	});

// });

new Quiz();