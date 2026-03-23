#import "template.typ": *
#let title = "Homework #10"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Algebraic Topology I"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2026"
#let prob_type = "covering space and lifting criterion"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)
#show math.equation.where(block: true): eq => {
  block(width: 100%, inset: 0pt, align(center, eq))
}

#prob[
  Let $p: E to B$ be a covering map. Then the diagonal $ Delta = {(e,e): e in E} subset.eq E times E $ is open and closed in $Z = {(x,y) in E times E: p(x) = p(y)}$.
]

#prob[
  Let $p: E to B$ be a covering map. Let $f_0, f_1 : X to E$ be two liftings of a map $f: X to B$. Suppose $f_0$ and $f_1$ agree somewhere. If $X$ is connected, then $f_0 = f_1$.     
]