import dotenv from 'dotenv';
import express from 'express';
import escapeStringRegexp from 'escape-string-regexp';

dotenv.config();

const baseURL = process.env.BASE_URL || 'http://localhost:3000';
const escapedBaseURL = escapeStringRegexp(baseURL);
const headerRegExp = new RegExp(`^${escapedBaseURL}`);

export function isUserAuthenticated(req, res, next) {
  if (req.user) next();
  else res.sendStatus(401);
}

export function isUserOrganizerOrAdmin(req, res, next) {
  if (['ORGANIZER', 'ADMIN'].includes(req.user.userRole)) next();
  else res.sendStatus(401);
}

export function isUserAdmin(req, res, next) {
  if (req.user.userRole === 'ADMIN') next();
  else res.sendStatus(403);
}

export function isCSRF(req, res, next) {
  function isBaseURLMatch(header) {
    return headerRegExp.test(req.header(header));
  }

  if (isBaseURLMatch('referer') || isBaseURLMatch('origin')) next();
  else res.sendStatus(401);
}

export const sendQueriedDataOrError = res => (err, data) => {
  if (err) res.sendStatus(500);
  else res.send(data);
};

export const sendUpdateOutcome = res => (err, rawResponse) => {
  if (err) res.sendStatus(500);
  else res.sendStatus(200);
};
