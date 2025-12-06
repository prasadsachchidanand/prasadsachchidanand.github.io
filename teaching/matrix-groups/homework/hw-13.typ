#import "template.typ": *
#import "@preview/itemize:0.2.0" as el
#import "@preview/commute:0.3.0": arr, commutative-diagram, node
#let title = "Homework #13"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Matrix Groups"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "adjoin representation"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)


#show: el.default-enum-list

#prob[
  We have seen in the lecture that the map $"Ad": S p(1) to S O(3)$ is $2$-to-$1$ map by looking at the kernel of the map. We have also proved that the map is a local diffeomorphism at $I$. In order to prove that it is a double covering map, we need to show that it is a local diffeomorphism at every point and it is surjective. 

  #set enum(numbering: "i)")
  + Show that  $"Ad"$ is a local diffeomorphism (use the left translation). 

  + Show that local diffeomorphism are open maps. 

  + Using (ii) and $S O(3)$ being connected, show that the map is surjective.    
]

#v(1cm)

#prob[
  #text(blue, size: 12pt, [This problem describe the adjoint representation for $S O(3)$.])
  
  Consider a basis of $frak(s o)(3)$ as 
  $
    E_1 = mat(0,0,0;0,0,-1;0,1,0), quad E_2 = mat(0,0,1; 0,0,0; -1,0,0), quad E_3 = mat(0, -1,0; 1,0,0;0,0,0).
  $

  #set enum(numbering: "i)")
  + Show that $ [E_1, E_2] = E_3, [E_2, E_3]= E_1, "and" [E_3, E_1] = E_2. $

  + Let $g = mat(0,1,0; -1, 0, 0; 0,0, 1)$.  With the above basis, find the matrix of $"Ad"_g: frak(s o)_3 to frak(s o)_3$. 

  + Consider a vector space isomorphism $ f: RR^3 to frak(s o)_3, quad bf(v) = (v_1, v_2, v_3) mapsto v^and := mat(0, -v_3, v_2; v_3, 0, -v_1; -v_2, v_1, 0). $ For any $bf(v), bf(w) in RR^3$, Show that $bf(v)^and bf(w) = bf(v) times bf(w)$, where $times$ is the cross product. 

  + For any $R in S O(3)$, show that $ R ( bf(v) times bf(w)) = R bf(v) times R (bf(w)). $ Hence or otherwise, conclude that $ R bf(v)^and R^(-1) = (R bf(v))^and. $

  + Express $(R e_i)^and$ in the basis ${E_1, E_2, E_3}$ and conclude that $"Ad"$ is an inclusion map.    
]

#pagebreak()

#prob[
  #set enum(numbering: "i)")
  + Show that $frak(s o)_3$ is not abelian and hence conclude that $S O(3)$ is not abelain. 

  + Show that $S O(3)$ is not abelain by finding two matrices in $S O(3)$ which do not commute. 

  + Use (ii), to prove that $S O(n)$ is not abelian for $n >= 3$.   
]

#prob[
  #text(blue, size: 12pt, [In this problem we will show that $S p(1) times S p(1)$ is a double cover of $S O(4)$.])

  #v(.5cm)
  #set enum(numbering: "i)")
  + If $G_1, G_2$ are two matrix groups, show that $G_1 times G_2$ is a matrix group. So, $S p(1) times S p(1)$ is a matrix group. 

  + For any $bf(v) in HH tilde.equiv RR^4$, Consider the map $ phi: S p(1) times S p(1) to G L_4(RR), quad (g_1, g_2) mapsto  g_1 bf(v) macron(g)_2. $ Show that the image will lie in $S O(4)$. 

  + By finding the kernel of the map, show that it is $2$-to-$1$ map. 

  + Show that it is a local diffeomorphism (apply inverse function theorem)

  + Show that the map is surjective and hence conclude that $S p(1) times S p(1)$ is a double cover of $S O(4)$. 
]