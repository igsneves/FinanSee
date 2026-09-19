var menuItem = document.querySelectorAll('.item-menu')
function selectLink(){
    menuItem.forEach((item)=> 
        item.classList.remove('ativo')
    )
    this.classList.add('ativo')
}

menuItem.forEach((item)=>
    item.addEventListener('click', selectLink)
)

//expandir Menu

var btn_exp = document.querySelector('#btn-exp')
var menuSide = document.querySelector('.menu-lateral')

btn_exp.addEventListener('click', function(){
    menuSide.classList.toggle('expandir')
})