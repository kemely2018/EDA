class Point {
    constructor (x, y, userData ){
        this .x = x;
        this .y = y;
        this . userData = userData ;
    }
}

class Rectangle {
    constructor (x, y, w, h){
        this .x = x; // centro
        this .y = y;
        this .w = w; // half width
        this .h = h; // half height
    }
    // verifica si este objeto contiene un objeto Punto
    contains ( point ){
        if(point.x >= this.x - this.w && point.x <= this.x + this.w &&
           point.y >= this.y - this.h && point.y <= this.y + this.h)
                return true;
        return false;
    }

    // verifica si este objeto se intersecta con otro objeto Rectangle
    intersects ( range ){
        if(range.x - range.w > this.x + this.w ||range.x + range.w < this.x - this.w ||
           range.y - range.h > this.y + this.h || range.y + range.h < this.y - this.h)
            return false;
        return true;
    }
}

class QuadTree {
    constructor ( boundary , n){
        this . boundary = boundary ; // Rectangle
        this . capacity = n; // capacidad maxima de cada cuadrante
        this . points = []; // vector , almacena los puntos a almacenar
        this . divided = false ;
    }

    insert(point){
        //Si el punto no esta en los limites ( boundary ) del quadtree Return
        if (!this.boundary.contains(point)) {
            return;
        }
        //Si ( this . points . length ) < ( this . capacity )
        if (this.points.length < this.capacity) {
            //Insertamos en el vector this . points
            this.points.push(point);
          
        }
        else{
            //Dividimos si aun no ha sido dividido
            if (!this.divided){
                this.subdivide();
            }
            //Insertamos recursivamente en los 4 hijos
            this.northeast.insert(point); 
            this.northwest.insert(point);
            this.southeast.insert(point); 
            this.southwest.insert(point);
        }
    }

    //divide el quadtree en 4 quadtrees
    subdivide(){
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w / 2;
        let h = this.boundary.h / 2;
        // Crear 4 hijos
        let ne = new Rectangle(x + w, y - h, w, h);
        let nw = new Rectangle(x - w, y - h, w, h);
        let se = new Rectangle(x + w, y + h, w, h);
        let sw = new Rectangle(x - w, y + h, w, h);
        //Asignar los QuadTree creados a cada hijo
        this.northeast = new QuadTree(ne, this.capacity);
        this.northwest = new QuadTree(nw, this.capacity);
        this.southeast = new QuadTree(se, this.capacity);
        this.southwest = new QuadTree(sw, this.capacity);
        //Hacer : this . divided <- true
        this.divided = true;
    }

    //EJERCICIO 1 PRACTICA 03
    /*range(area de busqueda)que puntos estan en
    este sector
    found:vector de los puntos que estan dentro 
    del range */
    //reporta los puntos que estan en un rango
    query(range,found){
        if(!found){
            found=[];
        }
        //no se intercepta con los limites del cuadrante
        if(!range.intersects(this.boundary)){
            return found;
        }
        //Ciclo por cada punto del queadtree
        for(let p of this.points){
            //Verificamos si esta dentro del rango
            if(range.contains(p)){
                //Lo insertamos en el vector found
                found.push(p);
                count++;
            }
        }
        //Si ha sido dividido
        if(this.divided){
            //Llamamos recursivamente a cada hijo
            this.northwest.query(range,found);
            this.northeast.query(range,found);
            this.southwest.query(range,found);
            this.southeast.query(range,found);
        }
        return found;
    }

    show (){
        stroke (255) ;
        strokeWeight (1) ;
        noFill ();
        rectMode ( CENTER );
        rect( this.boundary.x,this.boundary.y,this.boundary.w*2,this.boundary.h*2) ;
        if( this . divided ){
            this . northeast . show ();
            this . northwest . show ();
            this . southeast . show ();
            this . southwest . show ();
        }
        for (let p of this . points ){
            strokeWeight (4) ;
            point (p.x, p.y);
        }
    }
}