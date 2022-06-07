window.addEventListener('DOMContentLoaded', function(){

    // Tabs
    
	let tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	function hideTabContent() {
        
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
	}

	function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }
    
    hideTabContent();
    showTabContent();

	tabsParent.addEventListener('click', function(event) {
		const target = event.target;
		if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
		}
    });
    
    // Timer

    const deadline = '2022-11-11';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor( (t/(1000*60*60*24)) ),
            seconds = Math.floor( (t/1000) % 60 ),
            minutes = Math.floor( (t/1000/60) % 60 ),
            hours = Math.floor( (t/(1000*60*60) % 24) );

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num){
        if (num >= 0 && num < 10) { 
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {

        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');
        //modalCloseBtn = document.querySelector('[data-close]'); // - удалили на 54 уроке

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }
    
    // modalCloseBtn.addEventListener('click', closeModal); - удалили также на 54 уроке

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == "") {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) { 
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 300000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    // Используем классы для карточек


    // создаем новый класс c именем, класс начинается с большой буквы
        // создаем конструктор, указываем параметры, которые будем передавать ему, тут parentSelector - параметр, который будет указывать, куда мы будем вставлять div 

        // создаем метод в объекте, соответственно, две скобки справа

         // функция - обертка, сюда мы будем засовывать нашу верстку
        // обращаем внимание: когда класс создаем через create element, точка перед div не ставится
    class MenuCard { 


        constructor (src, alt, title, descr, price, parentSelector,...classes) { 
        this.src = src;
        this.alt = alt; 
        this.title = title; 
        this.descr = descr;
        this.price = price;
        this.classes = classes;
        this.parent = document.querySelector(parentSelector);
        this.transfer = 27;
        this.changeToUAH();
        
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

       
        render () {
const element = document.createElement('div'); 

if (this.classes.length === 0) {
    this.element = 'menu__item';
    element.classList.add(this.element);
}
else {
    this.classes.forEach(className => element.classList.add(className));
}
           
            
            element.innerHTML = ` 
           
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
       
            `;
            this.parent.append(element);
        }
    }

    
    const getResource = async (url) => {
        const res = await fetch(url);
        if(!res.ok) {

            throw new Error(`Could not fetch ${url}, status: ${res.status}`);

        }
        
        return await res.json();

    };

    // getResource('http://localhost:3000/menu')
    // .then(data => {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //     });
    // });


    axios.get('http://localhost:3000/menu').then(data => {
        data.data.forEach(({img, altimg, title, descr, price}) => 
        {new MenuCard(img, altimg, title, descr, price, '.menu .container').render();});});

// new MenuCard(
//     "img/tabs/vegy.jpg",
//     "vegy", 
//     'Меню "Фитнес',
//     'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Для людей, которые интересуются спортом; активных и здоровых. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
//     9,
//     '.menu .container',
     
//     // 'big'
    

// ).render();

// new MenuCard(
//     "img/tabs/elite.jpg",
//     "elite", 
//     'Меню "Премиум"',
//     'Меню “Премиум” - мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
//     20,
//     '.menu .container' 
    

// ).render(); 



// new MenuCard(
//     "img/tabs/post.jpg",
//     "post", 
//     'Меню "Постное"',
//     'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
//     16,
//     '.menu .container'
    

// ).render();

//Forms

const forms = document.querySelectorAll('form');

const message = {
loading: 'img/form/spinner.svg',
success: 'Спасибо, скоро мы с вами свяжемся',
failure: 'что-то пошло не так...'
};

 forms.forEach(item => {
    bindPostData(item);
});

const postData = async (url, data) => {
        const res = await fetch(url,{
            method: 'POST',
            headers: {
            'Content-type':'application/json'
        },
        body: data
        });
    return await res.json();
};

function bindPostData (form) {
    form.addEventListener('submit', (e) => {
e.preventDefault();

let statusMessage = document.createElement('img');
statusMessage.src = message.loading;
statusMessage.style.cssText = `
    display: block;
    margin: 0 auto;
`;
// form.append(statusMessage);
form.insertAdjacentElement('afterend', statusMessage); // в аргументах указываем куда мы вставляем и то, что мы хотим вставить

 // тут нужно проверить работает ли все правильно

 

//  request.setRequestHeader('Content-type': 'application/json'); // у Сабы спросить че за нафиг
const formData = new FormData(form);

const json = JSON.stringify(Object.fromEntries(formData.entries()));


// const object = {};
// formData.forEach(function(value,key){
//     object[key] = value; //у Сабы спросить 
// });

postData('http://localhost:3000/requests',json)
    .then(data => {
     console.log(data);
     showThanksModal(message.success);
     statusMessage.remove();
 
    }).catch(()=>{
        showThanksModal(message.failure);
    }).finally(()=>{
        form.reset();
    });

    });
}

function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.add('hide');
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
        </div>
        `;
    document.querySelector('.modal').append(thanksModal);
    setTimeout(()=>{
        thanksModal.remove();
        prevModalDialog.classList.add('show');
        prevModalDialog.classList.remove('hide');
        closeModal();
    }, 4000);

    

}
    
/*

//test posting to fake api site

fetch('https://fakestoreapi.com/products',{
            method:"POST",
            body:JSON.stringify(
                {
                    title: 'test product',
                    price: 13.5,
                    description: 'lorem ipsum set',
                    image: 'https://i.pravatar.cc',
                    category: 'electronic'
                }
            )
        })
            .then(res=>res.json())
            .then(json=>console.log(json));

fetch('https://fakestoreapi.com/products', {
    method:'GET', 

})

*/

const prevElem = document.querySelector('.offer__slider-prev');
const nextElem = document.querySelector('.offer__slider-next');
const currentNum = document.getElementById('current');
const totalNum = document.getElementById('total');
const slideImgs = document.querySelectorAll('.offer__slide');


let slideIndex = 1; 

showSlideNumbers(slideIndex);

function showSlideNumbers (n) {
    if(n > slideImgs.length) {
        slideIndex = 1;
    }

    if (n < 1) {
        slideIndex = slideImgs.length;
    }
    slideImgs.forEach(element => element.style.display = 'none');
    slideImgs[slideIndex-1].style.display = 'block';
    if(slideIndex < 10){
      currentNum.innerHTML =  `0${slideIndex}`;
    }
    
    if (slideImgs.length < 10) {
        totalNum.innerHTML = `0${slideImgs.length}`;
    }
    



}



function plusSlides (n) {
    showSlideNumbers(slideIndex += n);
}

prevElem.addEventListener('click', ()=>{
   plusSlides(-1);
});
nextElem.addEventListener('click', ()=>{
    plusSlides(1);
});


const result = document.querySelector('.calculating__result span');

let sex = 'male',
    height, weight, age, 
    ratio = 1.375; 


function calcTotal () {
if (!sex || !height || !weight || !age || !ratio) {
    result.innerHTML = "______";
    return;
}
if (sex === 'female') {

    result.textContent = Math.round((447.6 + 9.2 * weight + 3.1 * height - 4.3 * age) * ratio);

}

if (sex === 'male') {

    result.textContent = Math.round((88.36 + 13.4 * weight + 4.8 * height - 5.7 * age) * ratio);
}

// sex = document.querySelector('.calculating__choose-item_active').innerText;


}
calcTotal();


function getStaticInformation (parentSelector, activeClass) {
    const elements =  document.querySelectorAll(`${parentSelector} div`);
     
    elements.forEach(elem => {
        elem.addEventListener('click', (e) =>{

            if(e.target.getAttribute('data-ratio')) {
                ratio = +e.target.getAttribute('data-ratio');
            }
            else {
                sex = e.target.getAttribute('id');
            }
    
               
            elements.forEach(elem=>{elem.classList.remove(activeClass);
            });
            e.target.classList.add(activeClass);

            calcTotal();

        });
    });

    }
    


getStaticInformation('#gender', 'calculating__choose-item_active');
getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');


function getDynamicInformation(selector){
const input = document.querySelector(selector);
input.addEventListener('input', ()=>{
    switch(input.getAttribute('id')){
        case 'height': 
        height = input.value; 
        break;

    case 'weight':
        weight = input.value;
        break;

    case 'age':
        age = input.value;
        break;  

    } 
});
calcTotal();
}

getDynamicInformation('#height');
getDynamicInformation('#weight');
getDynamicInformation('#age');








});