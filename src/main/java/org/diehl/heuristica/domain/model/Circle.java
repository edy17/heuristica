package org.diehl.heuristica.domain.model;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class Circle {

    private Point center;
    private Line diameter;

    public Circle(Point center, Line diameter) {
        this.center = center;
        this.diameter = diameter;
    }

    public Point getCenter() {
        return this.center;
    }

    public Line getDiameter() {
        return diameter;
    }
}
