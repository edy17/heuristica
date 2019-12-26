package org.diehl.heuristica.domain.model;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class Line {

    private Point p;
    private Point q;

    public Line(Point p, Point q) {
        this.p = p;
        this.q = q;
    }

    public Point getP() {
        return this.p;
    }

    public Point getQ() {
        return this.q;
    }

    protected double distance() {
        return Math.sqrt(Math.pow(this.p.getX() - this.q.getX(), 2.0D) + Math.pow(this.p.getY() - this.q.getY(), 2.0D));
    }

    protected static double distance(Point p, Point q) {
        return Math.sqrt(Math.pow(p.getX() - q.getX(), 2.0D) + Math.pow(p.getY() - q.getY(), 2.0D));
    }
}
