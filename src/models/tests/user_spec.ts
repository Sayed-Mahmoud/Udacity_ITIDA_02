import { /* User, */ ApplicationUsers } from '../user'
// import express, { request, Response } from 'express'

const appUsers = new ApplicationUsers()

describe('Application Users Model', () => {
  it('should have an index method', () => {
    expect(appUsers.index).toBeDefined()
  })

  it('should have a show method', () => {
    expect(appUsers.show).toBeDefined()
  })

  it('should have a create method', () => {
    expect(appUsers.create).toBeDefined()
  })

  it('should have a delete method', () => {
    expect(appUsers.delete).toBeDefined()
  })

  it('should have a clear method to delete all users', () => {
    expect(appUsers.clear).toBeDefined()
  })
})

describe('Application Users Handler', () => {
  it('clear method should delete all exists users', async () => {
    const result = await appUsers.clear()
    expect(result).toBeGreaterThanOrEqual(0)
  })

  let createdId: number
  let hashedPass: string

  it('create method should add a user', async () => {
    const result = await appUsers.create({
      firstname: 'sayed',
      lastname: 'gomaa',
      password: 'test'
    })
    createdId = result.id as number
    hashedPass = result.password
    expect(result).toEqual({
      id: createdId,
      firstname: 'sayed',
      lastname: 'gomaa',
      password: hashedPass
    })
  })

  it('index method should return a list of users', async () => {
    const result = await appUsers.index()
    expect(result).toEqual([
      {
        id: createdId,
        firstname: 'sayed',
        lastname: 'gomaa',
        password: hashedPass
      }
    ])
  })

  it('show method should return the correct user', async () => {
    const result = await appUsers.show(createdId)
    expect(result).toEqual({
      id: createdId,
      firstname: 'sayed',
      lastname: 'gomaa',
      password: hashedPass
    })
  })

  it('delete method should remove the user', async () => {
    await appUsers.delete(createdId)
    const result = await appUsers.index()
    expect(result).toEqual([])
  })
})
