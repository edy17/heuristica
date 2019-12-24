package org.diehl.heuristica.domain.service;

import org.diehl.heuristica.domain.model.Circle;
import org.diehl.heuristica.domain.model.Line;

import javax.enterprise.context.ApplicationScoped;
import java.awt.*;
import java.util.ArrayList;
import java.util.Random;

@ApplicationScoped
public class MinimumCircleService {

    public Circle process(ArrayList<Point> points) {
        if (points.size() < 1) return null;
        ArrayList<Point> rest = (ArrayList<Point>) points.clone();
        Point dummy = rest.get(0);
        Point p = dummy;
        for (Point s : rest) if (dummy.distance(s) > dummy.distance(p)) p = s;
        Point q = p;
        for (Point s : rest) if (p.distance(s) > p.distance(q)) q = s;
        double cX = .5 * (p.x + q.x);
        double cY = .5 * (p.y + q.y);
        double cRadius = .5 * p.distance(q);
        rest.remove(p);
        rest.remove(q);
        while (!rest.isEmpty()) {
            Point s = rest.remove(0);
            double distanceFromCToS = Math.sqrt((s.x - cX) * (s.x - cX) + (s.y - cY) * (s.y - cY));
            if (distanceFromCToS <= cRadius) continue;
            double cPrimeRadius = .5 * (cRadius + distanceFromCToS);
            double alpha = cPrimeRadius / (double) (distanceFromCToS);
            double beta = (distanceFromCToS - cPrimeRadius) / (double) (distanceFromCToS);
            double cPrimeX = alpha * cX + beta * s.x;
            double cPrimeY = alpha * cY + beta * s.y;
            cRadius = cPrimeRadius;
            cX = cPrimeX;
            cY = cPrimeY;
        }
        Random generator = new Random();
        float i = 2*generator.nextFloat();
        Point a = new Point();
        Point b = new Point();
        a.setLocation(cX +  Math.cos(i*Math.PI)*cRadius, cY + Math.sin(i*Math.PI)*cRadius);
        b.setLocation(cX+  Math.cos(i*Math.PI-Math.PI)*cRadius, cY + Math.sin(i*Math.PI-Math.PI)*cRadius);
        return new Circle(new Point((int) cX, (int) cY), new Line(a,b));
    }

}
