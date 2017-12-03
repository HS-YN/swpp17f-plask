import { Component, ElementRef } from '@angular/core';

@Component({
    selector: 'autocomplete',
    host: {
        '(document:click)': 'handleClick($event)',
    },
})

export class AutoCompleteComponent {
    public query = '';
    public rawList = [];
    public filteredList = [];
    public elementRef;

    constructor(myElement: ElementRef, givenList: string[]) {
        this.elementRef = myElement;
        this.rawList = givenList;
    }

    filter() {
        if(this.query !== "") {
            this.filteredList = this.rawList.filter(function(el: String) {
                return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            }.bind(this));
            if(this.filteredList.length >= 10)
                this.filteredList = this.filteredList.slice(0,9);
        }
        else {
            this.filteredList = [];
        }
    }

    select(item) {
        this.query = item;
        this.filteredList = [];
    }

    handleClick(event) {
        var clickedComponent = event.target;
        var inside = false;
        do {
            if(clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if(!inside) {
            this.filteredList = [];
        }
    }
}
