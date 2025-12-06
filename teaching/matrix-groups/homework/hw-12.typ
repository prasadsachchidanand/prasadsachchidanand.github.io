#import "template.typ": *
#import "@preview/commute:0.3.0": arr, commutative-diagram, node
#let title = "Homework #12"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Matrix Groups"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "adjoint representation"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#theory[
  + Recall that for any matrix group $G$, and for any $g in G$, the conjugation  $ C_g: G to G, quad h mapsto g h g^(-1) $  is a smooth isomorphism and the derivative $(d C_g)_I : frak(g) to frak(g)$ is denoted by $"Ad"_g$. $ "Ad"_g (X) = g X g^(-1). $

  + The _Lie bracket_ of two vectors $A, B in frak(g)$ is defined as $ [A, B] : = "d"/("d"t)lr(|, size:#250%)_(t = 0) "Ad"_(a(t))(B) = A B - B A, $ where $a(t)$ is any differentiable path in $G$ with $a(0) = I$ and $a'(0) = A$.     

  + Let $f : G_1 to G_2$ be matrix group homomorphism with Lie algebras $frak(g)_1, frak(g)_2$. Let $f: G_1 to G_2$ be a smooth homomorphism. Then the derivative $"d"f_I: frak(g)_1 to frak(g)_2$ is a Lie algebra homomorphism. 

  + The map $"Ad"_g$ is a vector space isomorphism and hence induces a map $ "Ad" : G -> "GL"(n, RR), quad g mapsto "Ad"_g. $ This is called the _adjoint representation_ of $G$. 

  + We can pass from the representation of the matrix group to its Lie algebra by taking the derivative at the identity, which we will denote by $"ad"$. For any $X in frak(g)$, $ "ad"_X: frak(g) -> frak(g), quad Y mapsto [X, Y]. $  
]

#prob[
  Use the definition of the Lie bracket to prove the _*Jacobi identity*_ for a lie algebra $frak(g)$. That is, for any $A, B, C in frak(g)$, show that 
  $
    [[A, B], C] + [[B, C], A] + [[C, A], B] = 0.
  $ 
]

#prob[
  #set enum(numbering: "i)")
  
  + Use (3) to show that smoothly isomorphic matrix groups have isomorphicc Lie algebras. 

  + We have seen that the converse need not be true. For example, $O(n, RR)$ and $S O(n, RR)$ has the same Lie algebra but we will prove that the Lie groups are not isomorphic. 

    #set enum(numbering: "a)")
    +  Show that $S O(n, RR)$ is a normal subgroup of $O(n, RR)$ of index $2$. 

    +   $S O(n, RR)$ does not have a normal subgroup of index $2$.  
]

#prob[
  The goal of this exercise is to show that for any $X in frak(g)$, we have $"Ad"_(e^X) = e^("ad"_X)$.

  #set enum(numbering: "i)")  

  + Show that $(d"Ad")_I (X) = "ad"_X$ for any $X in frak(g)$.

  + Let $G_1$ and $G_2$ be two matrix groups with Lie algebras $frak(g)_1$ and $frak(g)_2$ respectively. Let $f: G_1 to G_2$ be $C^1$ homomorphism. Prove that for all $v in frak(g)_1$, $f(e^v) = e^("d"f_I (v)) .$  Hence, conclude that $"Ad"_(e^X) = e^("ad"_X)$.
]

#prob[
  Let $G_1, G_2$ be matrix groups with Lie algebras $frak(g)_1$ and $frak(g)_2$ respectively. Suppose that $f: G_1 to G_2$ is a smooth homomorphism. If $d f_I : frak(g)_1 to frak(g)_2$ is bijective, prove that $d f_g: T_g G_1 to T_(f(g))G_2$ is bijective for all $g in G_1$.       
]

#prob[
  Let $G$ be a path connected matrix group, and let $U$ be a neighbourhood of $I$ in $G$. Prove that $U$ generates $G$, which means that every element of $G$ is equal to a finite product $g_1 g_2 dots g_k$ where $g_i in U$ for $i = 1, 2, dots, k$.          
]

#prob[
  For a matrix group $G$ of dimension $n$, prove that the function $"Ad": G to G L(n, RR)$ is smooth.    
]