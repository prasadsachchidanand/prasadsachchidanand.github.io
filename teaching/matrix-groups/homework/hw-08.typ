#import "template.typ": *
#import "@preview/commute:0.3.0": arr, commutative-diagram, node
#let title = "Homework #8"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Matrix Groups"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "orthogonal groups"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#prob[
    We have seen that 
    $
        O(2) = {mat(cos theta, sin theta; -sin theta, cos theta): theta in RR} union.big {mat(cos theta, sin theta; sin theta, -cos theta): theta in RR} .
    $ 
    (1) Show that for every $A in O(2) - S O(2)$, the corresponding linear map $R_A : bb(R)^n to RR^n$ is a flip about some line through the origin. How is this line determined by the angle of $A$.

    (2) Let $B in S O(2)$ and $theta in.not pi ZZ$. Prove that $B$ does not commute with any $A in O(2) - S O(2)$.  

    (Hint: Show that $R_(A B)$ and $R_(B A)$ act differently on the line in $RR^2$ about which $A$ is flipped.    
]

#prob[
    Describe the product of two arbitrary elements of $O(2)$ in terms of their angles.  
]

#prob[
    Let $A in O(n)$ with determinant $-1$. Prove that 
    $
        O(n) = S O(n) union { A dot B : B in S O(n)}.
    $  
]

#prob[
    Define a map 
    $
        f: O(n) to S O(n) times {1, -1}, quad A |->(det (A) dot A, det A). 
    $
    (1) If $n$ is odd, then $f$ is an isomorphism. 

    (2) Prove that $O(2)$ is not isomorphic to $S O(2) times {1, -1}$. Hint: Look for finite order elements.   
]

#prob[
    Prove that $"Tran"(RR^n)$ is a normal subgroup of $"Isom"(RR^n)$. 
]
